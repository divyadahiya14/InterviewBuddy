import AIInterviewReport from '../models/AIInterviewReport.js';
import * as aiService from './aiService.js';

const cleanCodeBlock = (code) => {
  if (!code) return '';
  let cleaned = code.trim();
  if (cleaned.startsWith('```')) {
    const firstNewLine = cleaned.indexOf('\n');
    if (firstNewLine !== -1) {
      cleaned = cleaned.substring(firstNewLine + 1);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
  }
  return cleaned.trim();
};

const isPlaceholderOrEmptyExpectedSolution = (code) => {
  if (!code || !code.trim()) return true;
  const cleaned = code.trim();
  const lines = cleaned.split('\n');
  const nonCommentLines = lines.filter(line => {
    const l = line.trim();
    return l.length > 0 && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*') && !l.endsWith('*/') && !l.startsWith('#');
  });
  return nonCommentLines.length === 0;
};

const parseTheoryList = (content, prefix) => {
  const list = [];
  if (!content || !content.trim()) {
    return list;
  }

  // Split by double newline or single newline
  let parts = content.split('\n\n');
  if (parts.length <= 1) {
    parts = content.split('\n');
  }

  const regex = new RegExp(`^${prefix}\\s*\\d*\\s*:.*`, 'i');

  for (const part of parts) {
    let trimmed = part.trim();
    if (!trimmed) continue;

    // Check if it starts with e.g. Q1: or Ans 1:
    if (trimmed.startsWith(prefix) || trimmed.match(regex)) {
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        trimmed = trimmed.substring(colonIdx + 1).trim();
      }
    }
    list.push(trimmed);
  }
  return list;
};

const processTheoryReport = async (report) => {
  console.log(`Processing theory report ID ${report.id}`);
  const questions = parseTheoryList(report.questionStatement, 'Q');
  const answers = parseTheoryList(report.submittedCode, 'Ans');

  if (questions.length === 0) {
    throw new Error('No questions found in report statement');
  }

  const request = {
    type: report.questionType,
    level: report.difficulty,
    questions: questions,
    answers: answers
  };

  const response = await aiService.evaluateTheory(request);

  const fbLower = response.feedback ? response.feedback.toLowerCase() : '';
  if (!response.feedback || fbLower.includes('unavailable') || (response.score === 0 && fbLower.includes('temporarily'))) {
    throw new Error('Theory feedback returned error/unavailable');
  }

  report.feedback = response.feedback;
  report.score = response.score;
  report.scores = Array.isArray(response.scores) ? response.scores : [];
  report.status = 'completed';
  report.timestamp = new Date();

  await report.save();
  console.log(`Theory report ID ${report.id} regenerated successfully!`);
};

const processCodingReport = async (report, onlyExpectedSolution = false) => {
  let language = report.language;
  if (!language || !language.trim()) {
    language = 'cpp'; // default fallback
  }

  // 1. Generate optimal expected solution if missing or placeholders
  let expectedSol = report.expectedSolution;
  const esLower = expectedSol ? expectedSol.toLowerCase() : '';
  if (
    !expectedSol ||
    !expectedSol.trim() ||
    esLower.includes('offline') ||
    esLower.includes('not available') ||
    esLower.includes('financial') || // prevent unrelated notes
    esLower.includes('investment') ||
    expectedSol === report.starterCode ||
    isPlaceholderOrEmptyExpectedSolution(expectedSol)
  ) {
    console.log(`Generating optimal solution for report ID ${report.id} in ${language}`);
    const prompt = `You are a senior algorithms expert.
Generate the COMPLETE, optimal and correct reference solution code in ${language} for this specific interview question:

QUESTION:
${report.questionStatement}

RULES:
- Return ONLY the raw code, fully compilable.
- Do NOT wrap in markdown blocks like \`\`\`.
- Do NOT include explanation or comments of greeting.
- Must exactly belong to the given question.`;

    const response = await aiService.callAI(prompt);
    expectedSol = cleanCodeBlock(response);
    report.expectedSolution = expectedSol;
  }

  if (onlyExpectedSolution) {
    report.status = 'completed';
    report.timestamp = new Date();
    await report.save();
    console.log(`Expected solution for completed report ID ${report.id} generated and saved!`);
    return;
  }

  // 2. Generate feedback
  console.log(`Generating coding feedback for report ID ${report.id}`);
  const feedbackJson = await aiService.generateFeedback(
    report.questionStatement,
    report.submittedCode,
    language
  );

  // Parse feedback
  const cleaned = feedbackJson
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  let parsedJson = cleaned;
  if (start !== -1 && end !== -1) {
    parsedJson = cleaned.substring(start, end + 1);
  }

  const feedbackResult = JSON.parse(parsedJson);

  // Validate feedback results
  const fbText = feedbackResult.feedback;
  const fbLower = fbText ? fbText.toLowerCase() : '';
  const codeQual = feedbackResult.codeQuality;
  const cqLower = codeQual ? codeQual.toLowerCase() : '';

  if (
    !fbText ||
    !fbText.trim() ||
    fbLower.includes('rate limit') ||
    fbLower.includes('busy') ||
    fbLower.includes('high volume') ||
    fbLower.includes('failed') ||
    fbLower.includes('quota') ||
    fbLower.includes('unavailable') ||
    cqLower === 'error' ||
    cqLower === 'analysis pending'
  ) {
    throw new Error('AI returned rate limit or error feedback');
  }

  // Save successful results
  report.timeComplexity = feedbackResult.timeComplexity;
  report.spaceComplexity = feedbackResult.spaceComplexity;
  report.codeQuality = feedbackResult.codeQuality;
  report.feedback = feedbackResult.feedback;
  report.score = feedbackResult.score;
  report.status = 'completed';
  report.timestamp = new Date();

  await report.save();
  console.log(`Coding report ID ${report.id} regenerated successfully!`);
};

// Scheduler run function
export const regeneratePendingReports = async () => {
  try {
    // Find reports where status is in ['pending', 'failed_quota', 'failed_timeout', 'retrying', null, '']
    // OR status is completed, but is coding type and expectedSolution is placeholder/missing
    const reports = await AIInterviewReport.find({
      $or: [
        {
          $and: [
            {
              $or: [
                { status: { $in: ['pending', 'failed_quota', 'failed_timeout', 'retrying'] } },
                { status: null },
                { status: '' }
              ]
            },
            {
              $or: [
                { retryCount: { $lt: 3 } },
                { retryCount: null }
              ]
            }
          ]
        },
        {
          status: 'completed',
          language: { $ne: 'theory' },
          questionType: { $nin: ['fundamentals', 'web development', 'web'] },
          $or: [
            { expectedSolution: { $in: [null, ''] } },
            { expectedSolution: /^\s*(\/\/\s*([a-zA-Z0-9\+\#\s]+)?solution\s*)$/i },
            { expectedSolution: /^\s*(\/\/\s*Diagnostic starter template fallback\s*)/i }
          ]
        }
      ]
    });

    if (reports.length === 0) {
      return;
    }

    console.log(`Found ${reports.length} reports to regenerate.`);

    for (const report of reports) {
      try {
        // processing state check with 5 min lock timeout
        if (
          report.status === 'processing' &&
          report.timestamp &&
          report.timestamp > new Date(Date.now() - 5 * 60 * 1000)
        ) {
          continue;
        }

        // If it is already completed, check if it just needs expectedSolution regeneration
        if (report.status === 'completed') {
          const isTheory =
            report.language === 'theory' ||
            report.questionType === 'fundamentals' ||
            report.questionType === 'web development' ||
            report.questionType === 'web';
          
          if (isTheory) {
            continue; // theory has no code
          }

          if (isPlaceholderOrEmptyExpectedSolution(report.expectedSolution)) {
            // Lock and process expected solution only
            report.status = 'processing';
            report.timestamp = new Date();
            await report.save();
            await processCodingReport(report, true);
          }
          continue;
        }

        // For empty reports, verify if it actually needs regeneration
        if (!report.status || report.status === 'pending') {
          const fb = report.feedback;
          const fbLower = fb ? fb.toLowerCase() : '';
          const cq = report.codeQuality;
          const cqLower = cq ? cq.toLowerCase() : '';
          const sc = report.score;

          const needsRegen =
            !fb ||
            !fb.trim() ||
            fbLower.includes('rate limit') ||
            fbLower.includes('busy') ||
            fbLower.includes('high volume') ||
            fbLower.includes('failed') ||
            fbLower.includes('quota') ||
            fbLower.includes('unavailable') ||
            cqLower === 'error' ||
            cqLower === 'analysis pending' ||
            sc === undefined ||
            sc === null;

          if (!needsRegen) {
            report.status = 'completed';
            await report.save();
            continue;
          }
        }

        // Lock report as processing
        let currentRetry = report.retryCount || 0;
        report.retryCount = currentRetry + 1;
        report.status = 'processing';
        report.timestamp = new Date();
        await report.save();

        const isTheory =
          report.language === 'theory' ||
          report.questionType === 'fundamentals' ||
          report.questionType === 'web development' ||
          report.questionType === 'web';

        if (isTheory) {
          await processTheoryReport(report);
        } else {
          await processCodingReport(report);
        }
      } catch (err) {
        console.error(`Failed to regenerate report ID ${report.id}:`, err.message);

        // Determine failed status
        let failedStatus = 'retrying';
        const msg = err.message ? err.message.toLowerCase() : '';
        if (msg.includes('quota') || msg.includes('credit') || msg.includes('limit')) {
          failedStatus = 'failed_quota';
        } else if (msg.includes('timeout') || msg.includes('time out')) {
          failedStatus = 'failed_timeout';
        }

        // Save failure status
        report.status = failedStatus;
        report.timestamp = new Date();
        await report.save();
      }
    }
  } catch (outerEx) {
    console.error('Error in AIRegenerationScheduler:', outerEx.message);
  }
};

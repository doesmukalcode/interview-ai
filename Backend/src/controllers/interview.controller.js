const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterViewController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    const { selfDescription, jobDescription } = req.body;
    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        message: "selfDescription and jobDescription are required",
      });
    }

    const resumeData = await pdfParse(req.file.buffer);
    const resumeContent = resumeData.text;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      jobDescription,
      resume: resumeContent,
      selfDescription,
      ...interviewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (err) {
    console.error("Interview report error:", err);
    res.status(500).json({
      message: "Failed to generate interview report",
      error: err.message,
    });
  }
}

module.exports = { generateInterViewController };

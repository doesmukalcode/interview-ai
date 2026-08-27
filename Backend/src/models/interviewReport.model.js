const mongoose = require('mongoose');
/**
 * -job description schema: String
 * -resume text : String
 * -Self description : String
 * 
 * -matchScore : Number
 * 
 * -Technical questions : 
 *           [{
 *              question : "",
 *              intention : "",
 *              answer : ""
 *             }]
 * -Behavioral questions :
 *           [{
 *              question : "",
 *              intention : "",
 *              answer : ""
 *             }]
 * -Skill gaps : [{
 *              skill : "",
*               severity : {
*                 type : String,
*                 enum : ["low", "medium","high"]
*               }
 *              }]
 * -preparation plan : [{
 *               day : Number
 *               focus : String,
 *                tasks: [String]
 * 
 * }]
 */

const technicalQuestionsSchema = new mongoose.Schema({
    question: {
      type: String,
      required: [true,"Technical question is required"]
    },
      intention: {
      type: String,
      required: [true,"Intention is required"]
    },
      answer: {
      type: String,
      required: [true,"Answer is required"]
      },
  },
        
  {
    _id:false
  })

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
      type: String,
      required: [true,"Behavioral Question is required"]
    },
    intention:{
      type:String,
      required:[true,"Intention is required"]
    },
    answer: {
      type: String,
      required:[true,"Answer is required"]
    }},
    
    {
      _id : false
})

const skillGapSchema = new mongoose.Schema({
  skill:{
    type:String,
    required:[true,"Skill is required"]
  },
  severity: {
    type:String,
    enum: ["low","medium","high"],
    required: [true,"Severity is Required"]}
  },
  {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required:[true,"day is required"]
  },
  focus: {
    type: String,
    required:[true,"Focus is required"]
  },
  tasks: [{
    type:String,
    required: [true,"Focus is required"]
  }]
})

const inteviewReportSchema = new mongoose.Schema({
  jobDescription : {
    type:String,
    required: [true,"Job decription is required"]
  },
  resume:{
    type: String,
  },
  selfDescription:{
    type: String,
  },
  matchScore: {
    type: Number,
    min:0,
    max:100,
  },
  technicalQuestions: [technicalQuestionsSchema],
  behavioralQuestions: [behavioralQuestionSchema],
  skillGaps: [skillGapSchema],
  preparationPlan: [preparationPlanSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
  },
  {
    timestamps:true
  
})


const interviewReportModel = mongoose.model("InterviewReport",
  interviewReportSchema);

module.exports = interviewReportModel;
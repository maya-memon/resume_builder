import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyCEsebWWake1bLwWKY3CuVzNlacuArz4M4');

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateJobDescription(position, company, industry = '') {
    const prompt = `Generate a professional job description for a ${position} position at ${company}${industry ? ` in the ${industry} industry` : ''}. 
    
    Format the response as bullet points highlighting key responsibilities and achievements. Focus on:
    - Specific technical skills and accomplishments
    - Leadership and collaboration experiences
    - Quantifiable results and impact
    - Industry-relevant keywords
    
    Keep it concise and professional, around 3-4 bullet points.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating job description:', error);
      throw new Error('Failed to generate job description. Please try again.');
    }
  }

  async generateProjectDescription(projectName, technologies = [], projectType = '') {
    const techStack = technologies.length > 0 ? technologies.join(', ') : 'modern web technologies';
    const prompt = `Generate a professional project description for "${projectName}"${projectType ? `, a ${projectType} project` : ''} built with ${techStack}.
    
    Include:
    - Brief overview of the project's purpose and functionality
    - Key technical features and implementations
    - Your role and contributions
    - Impact or results achieved
    
    Keep it concise and professional, around 2-3 sentences.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating project description:', error);
      throw new Error('Failed to generate project description. Please try again.');
    }
  }

  async generateProfessionalSummary(personalInfo, experience = [], skills = []) {
    const name = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
    const experienceText = experience.length > 0 
      ? `with experience in ${experience.map(exp => exp.position).join(', ')}` 
      : '';
    const skillsText = skills.length > 0 
      ? `skilled in ${skills.slice(0, 5).join(', ')}` 
      : '';

    const prompt = `Generate a professional summary for ${name}, a professional ${experienceText}${skillsText ? ` and ${skillsText}` : ''}. 
    
    The summary should:
    - Be 2-3 sentences long
    - Highlight key strengths and expertise
    - Be engaging and professional
    - Include relevant industry keywords
    - Focus on value proposition to employers
    
    Make it compelling and tailored for resume use.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating professional summary:', error);
      throw new Error('Failed to generate professional summary. Please try again.');
    }
  }

  async suggestSkills(industry = '', currentSkills = []) {
    const prompt = `Suggest 10 relevant professional skills for someone in the ${industry || 'technology'} industry. 
    
    Current skills to avoid duplicating: ${currentSkills.join(', ')}
    
    Provide a mix of:
    - Technical skills
    - Soft skills
    - Industry-specific skills
    
    Return only the skill names, separated by commas.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const skillsText = response.text();
      return skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    } catch (error) {
      console.error('Error suggesting skills:', error);
      throw new Error('Failed to suggest skills. Please try again.');
    }
  }

  async generateCoverLetter(resumeData, jobTitle = '', companyName = '', jobDescription = '') {
    const { personalInfo, workExperience, skills } = resumeData;
    const name = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
    
    const prompt = `Generate a professional cover letter for ${name} applying for the position of ${jobTitle || 'the advertised position'} at ${companyName || 'your company'}.
    
    Use this information:
    - Name: ${name}
    - Email: ${personalInfo.email}
    - Recent experience: ${workExperience.length > 0 ? workExperience[0].position + ' at ' + workExperience[0].company : 'Various professional roles'}
    - Key skills: ${skills.technical?.slice(0, 5).join(', ') || 'Technical expertise'}
    ${jobDescription ? `- Job requirements: ${jobDescription}` : ''}
    
    The cover letter should:
    - Be professional and engaging
    - Highlight relevant experience and skills
    - Show enthusiasm for the role and company
    - Be around 3-4 paragraphs
    - Include proper business letter formatting
    
    Make it personalized and compelling.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw new Error('Failed to generate cover letter. Please try again.');
    }
  }

  async optimizeResumeForATS(resumeData, jobDescription = '') {
    const prompt = `Analyze this resume data and suggest improvements for ATS (Applicant Tracking System) optimization:
    
    Resume Summary: ${resumeData.personalInfo.summary || 'No summary provided'}
    Experience: ${resumeData.workExperience.map(exp => `${exp.position} at ${exp.company}`).join(', ')}
    Skills: ${resumeData.skills.technical?.join(', ') || 'No skills listed'}
    ${jobDescription ? `\nJob Description: ${jobDescription}` : ''}
    
    Provide specific suggestions for:
    1. Keywords to include
    2. Skills to emphasize
    3. Summary improvements
    4. Formatting recommendations
    
    Keep suggestions actionable and specific.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error optimizing resume for ATS:', error);
      throw new Error('Failed to optimize resume for ATS. Please try again.');
    }
  }
}

export default new GeminiService();

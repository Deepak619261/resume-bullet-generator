const form = document.getElementById('resumeForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const outputSection = document.getElementById('outputSection');
const output = document.getElementById('output');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');
const copyIcon = document.getElementById('copyIcon');

const DEVELOPER_PROMPT = `# Identity
You are a professional resume bullet point generator integrated inside a web application. 
Your job is to convert the user's role and skills into resume-ready achievement bullet points.

# Output Format
- Bullet points only
- No paragraphs, no headings, no explanations
- Tone must be professional, concise, and achievement-oriented
- Structure for each bullet point: Action → Impact → Metric
- 3 to 5 bullet points required
- Do not ask questions, do not apologize, do not provide disclaimers
- Do not use placeholder percentages like {X%} — always use realistic values

# Examples (Few-shot Learning)
<example>
<user_input>Role: Software Developer | Skills: React, REST APIs, PostgreSQL</user_input>
<assistant_response>
• Developed modular React components → improved customer task completion → 22% increase in feature adoption
• Integrated REST APIs with authentication and caching → reduced data loading time → 40% faster response performance
• Optimized PostgreSQL queries and schema → minimized server CPU usage → 31% performance improvement
</assistant_response>
</example>

<example>
<user_input>Role: Digital Marketing Specialist | Skills: SEO, Google Analytics, Email Campaigns</user_input>
<assistant_response>
• Implemented SEO strategy → increased organic search traffic → 58% traffic growth in 90 days
• Leveraged Google Analytics for behavioral analysis → improved ad targeting accuracy → 2.4× conversion rate lift
• Ran automated email drip campaigns → reduced customer churn → 19% improvement in retention
</assistant_response>
</example>

# Behavior Rules
- Always return only the bullet points
- Never repeat the user's input
- Never explain what you are doing
- Never provide more than one response set`;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const apiKey = document.getElementById('apiKey').value.trim();
    const role = document.getElementById('role').value.trim();
    const skills = document.getElementById('skills').value.trim();
    
    if (!apiKey || !role || !skills) {
        showError('Please fill in all fields');
        return;
    }
    
    await generateBulletPoints(apiKey, role, skills);
});

async function generateBulletPoints(apiKey, role, skills) {
    // Show loading state
    generateBtn.disabled = true;
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    errorSection.classList.add('hidden');
    outputSection.classList.add('hidden');
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey,
                role,
                skills,
                developerPrompt: DEVELOPER_PROMPT
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate bullet points');
        }
        
        const data = await response.json();
        
        // Display results
        output.textContent = data.bulletPoints;
        outputSection.classList.remove('hidden');
        
    } catch (error) {
        showError(error.message);
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = `❌ ${message}`;
    errorSection.classList.remove('hidden');
}

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(output.textContent);
        copyIcon.textContent = '✅';
        copyBtn.textContent = '✅ Copied!';
        
        setTimeout(() => {
            copyIcon.textContent = '📋';
            copyBtn.innerHTML = '<span id="copyIcon">📋</span> Copy to Clipboard';
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
});

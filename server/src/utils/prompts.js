const SAFETY_INSTRUCTIONS = `
Ensure the content maintains the brand's tone as described.
Avoid any controversial topics, political statements, or content that could be seen as offensive, discriminatory, or harmful.
Do not include misinformation, unverified claims, or anything that could lead to PR issues.
Keep content positive, engaging, and aligned with professional social media best practices.
`;

export function getIdeaPrompt(ideasCount, topicsPromptExpansion, tone) {
  return `Create a list of ${ideasCount} social media post ideas (concise and specific) and return them as a JSON array of strings.
Take this also into account: ${topicsPromptExpansion}
Maintain a ${tone} tone throughout.${SAFETY_INSTRUCTIONS}`;
}

export function getPostPrompt(platform, language, idea, postsPromptExpansion, brandStyle, tone) {
  return `Write a ${platform === 'Twitter' ? 'Tweet' : platform + ' post'} in ${language} for their account that talks about '${idea}'\n\nNote: avoid including any text or ideas which requires up-to-date information, or which could contain false data, or which mentions a real link or offered product/service
Take this also into account: ${postsPromptExpansion}
Follow these style guidelines: ${brandStyle.join(', ')}
Maintain a ${tone} tone.${SAFETY_INSTRUCTIONS}`;
}

export function getImageSystemPrompt(brandDescription, tone) {
  return `${brandDescription}${SAFETY_INSTRUCTIONS}
Maintain a ${tone} tone.`;
}

export function getImageUserPrompt(idea) {
  return `Define with 10-20 words the description for the image that will be used for the following post idea:\n\n'${idea}'.\n\nNote: You should describe all the items we will see in the image, and those items should NOT include people's faces, hands, text or animals, device screens or anything that could contain text.` + SAFETY_INSTRUCTIONS;
}
// WE ARE SWITCHING TO CODEX API (FREE, NO KEY, NO CARD REQUIRED)
const CODEX_API = "https://api.codex.jaagrav.in";

// Map your languages to Codex specific strings
// java -> java, python -> py, javascript -> js
const LANGUAGE_MAP = {
  javascript: "js",
  python: "py",
  java: "java",
};

export async function executeCode(language, code) {
  try {
    const mappedLanguage = LANGUAGE_MAP[language];

    if (!mappedLanguage) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // 1. Send code to Codex
    const response = await fetch(CODEX_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        language: mappedLanguage,
        input: "", // Optional: if you have user input
      }),
    });

    // 2. Handle API Errors
    if (!response.ok) {
       return { success: false, error: `API Error: ${response.status}` };
    }

    const data = await response.json();

    // 3. Format the output
    // Codex returns { output: "...", error: "..." }
    if (data.error && data.error.length > 0) {
      return { success: false, output: data.output, error: data.error };
    }

    return {
      success: true,
      output: data.output ? data.output : "No output",
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
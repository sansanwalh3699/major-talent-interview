// WE ARE SWITCHING TO JUDGE0 BECAUSE PISTON IS BLOCKED
const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";

// Judge0 uses ID numbers: Java=62, Python=71, JS=63
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
};

export async function executeCode(language, code) {
  try {
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // 1. Create the submission
    // query params: base64_encoded=false & wait=true (so we get the result immediately)
    const response = await fetch(`${JUDGE0_API}?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 👇 PASTE YOUR KEY HERE 👇
        "X-RapidAPI-Key": import.meta.env.VITE_JUDGE0_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
        stdin: "",
      }),
    });

    if (!response.ok) {
       const errText = await response.text();
       return { success: false, error: `API Error: ${response.status} ${errText}` };
    }

    const data = await response.json();

    // 2. Handle Errors (Compilation or Runtime)
    if (data.stderr) {
      return { success: false, output: data.stdout, error: data.stderr };
    }
    
    if (data.compile_output) { 
        return { success: false, error: data.compile_output };
    }

    // 3. Success
    return {
      success: true,
      output: data.stdout || "No output",
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

// const express = require("express");
// const { GoogleGenAI } = require("@google/genai");
// require("dotenv").config();

// const app = express();
// const port = 3000;

// // Middleware to parse JSON request body
// app.use(express.json());

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // Generate AI response
// app.post("/generate", async (req, res) => {
//   try {
//     // Get input from Thunder Client
//     const { inputText } = req.body;

//     // Check if input was provided
//     if (!inputText) {
//       return res.status(400).json({
//         error: "inputText is required",
//       });
//     }

//     const response = await ai.models.generateContent({
//       model: "gemini-3.8-flash",
//       contents: inputText,
//     });

//     res.json({
//       text: response.text,
//     });

//   } catch (error) {
//     console.error("Gemini API Error:", error);

//     res.status(500).json({
//       error: "Internal Server Error",
//     });
//   }
// });

// app.get("/", (req, res) => {
//   res.json({
//     message: "Hello World!",
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


//======================================================================//
//use of langchain over using SDK


//const express = require("express");
//const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

//require("dotenv").config();

//const app = express();
//const port = 3000;

//app.use(express.json());

//const llm = new ChatGoogleGenerativeAI({
  //model: "gemini-3.8-flash",
  //apiKey: process.env.GEMINI_API_KEY,
//});

//app.post("/generate", async (req, res) => {
  //try {
    //const { input } = req.body;

    //if (!input) {
      //return res.status(400).json({
        //error: "input is required",
      //});
    //}

    //const response = await llm.invoke(input);

    //res.json({
      //response: response.content,
    //});

  //} catch (error) {
    //console.error("LangChain Error:", error);

    //res.status(500).json({
      //error: "Internal Server Error",
    //});
 // }
//});

//app.get("/", (req, res) => {
  //res.json({
    //message: "LangChain API is running",
  //});
//});

//app.listen(port, () => {
  //console.log(`Server running at http://localhost:${port}`);
//});

//======================================================================================//

const express = require("express");

const { ChatGoogleGenerativeAI } =
  require("@langchain/google-genai");

const { ChatPromptTemplate } =
  require("@langchain/core/prompts");

require("dotenv").config();

const app = express();

const port = 3000;

app.use(express.json());


// -------------------------
// 1. MODEL
// -------------------------

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.8-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.4,
  maxTokens : 100,
  maxRetries: 3
});


// -------------------------
// 2. PROMPT
// -------------------------

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an expert software engineer. Explain concepts simply with examples.",
  ],
  [
    "human",
    "{input}",
  ],
]);


// -------------------------
// 3. CHAIN
// -------------------------

const chain = prompt.pipe(llm);


// -------------------------
// 4. API
// -------------------------

app.post("/generate", async (req, res) => {
  try {

    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: "input is required",
      });
    }

    const response = await chain.invoke({
      input,
    });

    res.json({
      response: response.content,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Something went wrong",
    });

  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
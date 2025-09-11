<a name="top"></a>

<h1 align="center">🤖 Medibot: AI Health Assistant 🩺</h1>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat)
![Built with Love](https://img.shields.io/badge/Built%20with-%E2%9D%A4-red?style=for-the-badge)
![Visitors](https://api.visitorbadge.io/api/Visitors?path=CharithaReddy18%2FAI-health-chatbot%20&countColor=%23263759&style=flat)
![GitHub Contributors](https://img.shields.io/github/contributors/CharithaReddy18/AI-health-chatbot)
![GitHub Last Commit](https://img.shields.io/github/last-commit/CharithaReddy18/AI-health-chatbot)
![GitHub Repo Size](https://img.shields.io/github/repo-size/CharithaReddy18/AI-health-chatbot)
![Github](https://img.shields.io/github/license/CharithaReddy18/AI-health-chatbot)

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h3>📖 Table of Contents</h3> 

- <a href="#overview"> Overview </a>
- <a href="#project-insights"> Project Insights </a>
- <a href="#features">Features</a>
- <a href="#tech-stack"> Tech Stack </a>
- <a href="#project-structure"> Project Structure </a>
- <a href="#installation-setup"> Installation & Setup</a>
- <a href="#future-advancements">Future Advancements</a>
- <a href="#roadmap">Roadmap</a>
- <a href="#acknowledgments">Acknowledgments</a>
- <a href="#contact">Contact</a>
- <a href="#how-to-contribute">How to Contribute</a>
- <a href="#contributing">Contributing</a>
- <a href="#code-of-conduct">Code of Conduct</a>
- <a href="#contribution-guidelines">Contribution Guidelines</a>
- <a href="#suggestions-feedback"> Suggestions & Feedback</a>
- <a href="#show-your-support">Show Your Support</a>
- <a href="#license">License</a>
- <a href="#stargazers">Stargazers</a>
- <a href="#forkers">Forkers</a>
- <a href="#project-admin">Project Admin</a>

> An **AI-Powered Health Assistant** that provides users with **health-related guidance**, **symptom analysis**, and **basic medical recommendations**.

It uses **rule-based logic** and a **RAG** (Retrieval-Augmented Generation) pipeline powered by a Groq LLM. When rule-based response fails, RAG fetches data from trusted medical databases to provide relevant answers for unhandled queries.

> ⚠️ **Disclaimer:** This chatbot is **not a replacement** for professional medical advice. Always consult a qualified healthcare provider for serious or persistent health issues.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## 💡 Overview

**Medibot** bridges the gap between users and healthcare professionals by offering:

* Understanding of user health queries
* Symptom analysis with possible next steps
* Rule-based responses for common health questions
* AI-powered fallback responses using Groq
* Efficient medical data retrieval via FAISS-based database
* Doctor specialist recommendations based on symptoms/diseases
* A user-friendly Streamlit web interface

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=00C853&center=true&vCenter=true&width=900&lines=Thanks+for+visiting+AI-health-chatbot!+🙌;Start+the+repo+✅;Share+it+with+others+🌍;Contribute+and+grow+🛠️;Happy+Coding+✨!" alt="Thanks Banner Typing SVG" />
</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="project-insights">📊 Project Insights</h2>

<table align="center">
    <thead align="center">
        <tr>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Closed PRs</b></td>
            <td><b>🛠️ Languages</b></td>
            <td><b>👥 Contributors</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/CharithaReddy18/AI-health-chatbot?style=flat&logo=github"/></td>
            <td><img alt="Forks" src="https://img.shields.io/github/forks/CharithaReddy18/AI-health-chatbot?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/CharithaReddy18/AI-health-chatbot?style=flat&logo=github"/></td>
            <td><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/CharithaReddy18/AI-health-chatbot?style=flat&logo=github"/></td>
            <td><img alt="Closed PRs" src="https://img.shields.io/github/issues-pr-closed/CharithaReddy18/AI-health-chatbot?style=flat&color=critical&logo=github"/></td>
            <td><img alt="Languages Count" src="https://img.shields.io/github/languages/count/CharithaReddy18/AI-health-chatbot?style=flat&color=green&logo=github"></td>
            <td><img alt="Contributors Count" src="https://img.shields.io/github/contributors/CharithaReddy18/AI-health-chatbot?style=flat&color=blue&logo=github"/></td>
        </tr>
    </tbody>
</table>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="features">🚀 Features</h2>

1. **Symptom Checker** - Check symptoms and answer health-related queries
2. **Rule Based Response** - Provides predefined answers for common health queries
3. **RAG Fallback** - Retrieves relevant details from the medical database when no rules match
4. **Doctor Specialist Recommendation** - Suggests specialists based on disease/symptom mapping

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

![GSSoC Logo](/AI-health-chatbot/client/public/gssoc%20logo.png)

🌟 **Exciting News...**

🚀 This project is now an official part of GirlScript Summer of Code – GSSoC'25! 💃🎉💻 We're thrilled to welcome contributors from all over India and beyond to collaborate, build, and grow *AI-health-chatbot!* Let’s make learning and career development smarter – together! 🌟👨‍💻👩‍💻

👩‍💻 GSSoC is one of India’s **largest 3-month-long open-source programs** that encourages developers of all levels to contribute to real-world projects 🌍 while learning, collaborating, and growing together. 🌱

🌈 With **mentorship, community support**, and **collaborative coding**, it's the perfect platform for developers to:

- ✨ Improve their skills
- 🤝 Contribute to impactful projects
- 🏆 Get recognized for their work
- 📜 Receive certificates and swag!

🎉 **I can’t wait to welcome new contributors** from GSSoC 2025 to this AI-health-chatbot project family! Let's build, learn, and grow together — one commit at a time. 🔥👨‍💻👩‍💻

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## 🧰 Tech Stack

* **Streamlit** – Interactive web app framework for the chatbot UI
* **Python** – Core programming language for backend logic
* **LangChain** – Orchestration framework for building the RAG pipeline
* **Groq API** – High-performance LLM used for natural language responses
* **FAISS** – Vector database for fast similarity search in retrieved documents
* **Hugging Face Transformers** – Embedding model for converting medical texts into vector representations

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="project-structure">📂 Project Structure</h2>

```plaintext
AI-HEALTH-CHATBOT/
├── backend/                    # FastAPI Backend Application
│   ├── app/
│   │   ├── Medical_DataBase/   # Stores the FAISS vector index for the RAG model
│   │   │   ├── index.faiss
│   │   │   └── index.pkl
│   │   ├── models/             # Pydantic schemas for data validation (schemas.py)
│   │   ├── routers/            # Defines the API endpoints (e.g., /chat, /disease)
│   │   │   ├── chat.py
│   │   │   ├── disease.py
│   │   │   └── health.py
│   │   ├── services/           # Contains the core business logic for all features
│   │   │   ├── disease_predictor.py
│   │   │   ├── health_info.py
│   │   │   ├── medical_agent.py # Manages the core RAG pipeline and LLM interaction
│   │   │   └── symptom_checker.py
│   │   ├── utils/              # Utility and helper functions
│   │   ├── config.py           # Handles configuration and environment variables
│   │   └── main.py             # The main entry point to launch the FastAPI server
│   ├── data/                   # Directory for raw data files like CSVs
│   └── requirements.txt        # A list of all Python dependencies
│
├── client/                     # React Frontend Application
│   ├── public/                 # Contains static assets like the main index.html and icons
│   ├── src/
│   │   ├── api/                # Functions for making HTTP requests to the backend
│   │   ├── assets/             # Stores local assets like images, fonts, and CSS
│   │   ├── components/         # Reusable React components (e.g., ChatWindow, Button)
│   │   ├── pages/              # Components representing entire pages or views
│   │   ├── App.jsx             # The main root component of the application
│   │   └── main.jsx            # The entry point for the React application
│   ├── package.json            # Lists Node.js dependencies and project scripts
│   └── vite.config.js          # Configuration file for the Vite build tool
│
└── README.md                   # You are here!
```


# AI Health Chatbot

Medibot is a Streamlit-based AI health assistant that provides symptom checking, health guidance, and doctor recommendations using NLP and Retrieval-Augmented Generation (RAG).

---

## 🚀 New Feature: NLP Enhancement (Multilingual Support)

- Added translation pipeline (English ↔ Hindi, Marathi, Telugu).
- Integrated multilingual embeddings with FAISS.
- Added language selector in Streamlit UI.
- Ensured responses maintain medical safety disclaimer.

### How to Run:
1. `pip install -r requirements.txt`
2. `streamlit run app/WellnessResourceHub.py`

---

## Features
- Symptom checking
- Doctor recommendation
- Medical knowledge retrieval
- **NEW: Multilingual support (Hindi, Marathi, Telugu, English)** ✅

---

## Disclaimer
This chatbot provides general health information and is **not a substitute for professional medical advice**.

---

<h2 id="installation-setup"> ⚡ Installation & Setup</h2>

**1️⃣ Clone the repository**

```bash
git clone https://github.com/yourusername/AI-health-chatbot.git
cd AI-health-chatbot
```

**2️⃣ Install dependencies**

```bash
pip install -r requirements.txt
```

**3️⃣ Set Environment Variables**

```env
GROQ_API_KEY="YOUR_KEY_HERE"
HUGGINGFACE_API_KEY="YOUR_KEY_HERE"
```

**4️⃣ Run the Streamlit app**

```bash
python -m streamlit run WellnessResourceHub.py
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="future-advancements">🚀 Future Advancements</h2>

* **Multi-language Support** – Enable chatbot to respond in multiple languages for broader accessibility.
* **Voice Input & Output** – Add speech-to-text and text-to-speech for hands-free interaction.
* **Conversational Memory** – Enable LLM to remember previous interactions and maintain context.
* **Mobile App Integration** – Bring Medibot to Android/iOS platforms.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="roadmap">📌 Roadmap</h2>

See the [ROADMAP.md](./ROADMAP.md) for upcoming features and plans.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## Issue Creation ✴

Report bugs and issues or propose improvements through our GitHub repository's "Issues" tab.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## Contribution Guidelines 📑

- Firstly Star (⭐) the Repository
- Fork the Repository and create a new branch for any updates/changes/issue you are working on.
- Start Coding and do changes.
- Commit your changes
- Create a Pull Request which will be reviewed and suggestions would be added to improve it.
- Add Screenshots and updated website links to help us understand what changes is all about.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## Contributing is fun🧡

We welcome all contributions and suggestions!
Whether it's a new feature, design improvement, or a bug fix - your voice matters 💜

Your insights are invaluable to us. Reach out to us team for any inquiries, feedback, or concerns.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="acknowledgments">🙏 Acknowledgments</h2>

- Thanks to all contributors of this project 
- Special shoutout to **GirlScript Summer of Code (GSSoC’25)** for the amazing community and support!
- Built with dedication, collaboration, and lots of chai

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="contact">📞 Contact</h2>

- **GitHub Issues**: [Report bugs or request features](https://github.com/CharithaReddy18/AI-health-chatbot/issues)
- **Email**: Contact the maintainers for collaboration opportunities

*Feel free to reach out with any questions or feedback!*

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="how-to-contribute">🤝How to Contribute</h2>

We love contributions from the community! Whether it's a bug report, a new feature, or a documentation improvement, we appreciate your help.

***How to Contribute***

1.  **Fork the repository** and create a new branch for your changes.
2.  **Make your changes** and ensure everything is working as expected.
3.  **Submit a pull request** with a clear description of your changes.

***Found a Bug?***

-   Check the [issue tracker](https://github.com/CharithaReddy18/AI-health-chatbot/issues) to see if the bug has already been reported.
-   If not, open a new issue and provide as much detail as possible.

***Have a Feature Idea?***

-   We'd love to hear it! Open an issue to discuss your idea.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="contributing">🤝 Contributing</h2>

We welcome contributions from developers of all skill levels! Here are some ways you can contribute:

### Ways to Contribute

- 🐛 Bug fixes - Help us identify and fix bugs
- ✨ New features - Suggest and implement new functionality
- 📚 Documentation - Improve our docs and guides
- 🎨 UI/UX improvements - Make the platform more user-friendly
- 🔧 Performance optimizations - Help make AI-health-chatbot faster and more efficient
- 📱 Mobile responsiveness - Improve the mobile experience
- 🔒 Security enhancements - Help keep user data safe

*Thank you to everyone who has made AI-health-chatbot better! 💚*

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="code-of-conduct">📜 Code of Conduct</h2>

Please refer to the [`Code of Conduct`](https://github.com/CharithaReddy18/AI-health-chatbot/blob/main/CODE_OF_CONDUCT.md) for details on contributing guidelines and community standards.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="contribution-guidelines">🤝👤 Contribution Guidelines</h2>

We love our contributors! If you'd like to help, please check out our [`CONTRIBUTING.md`](https://github.com/CharithaReddy18/AI-health-chatbot/blob/main/CONTRIBUTING.md) file for guidelines.


->Thank you once again to all our contributors who has contributed to **AI-health-chatbot!** Your efforts are truly appreciated. 💖👏

<!-- Contributors badge (auto-updating) -->

[![Contributors](https://img.shields.io/github/contributors/CharithaReddy18/AI-health-chatbot?style=for-the-badge)](https://github.com/CharithaReddy18/AI-health-chatbot/contributors)

<!-- Contributors avatars (auto-updating) -->
<p align="left">
  <a href="https://github.com/CharithaReddy18/AI-health-chatbot/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=CharithaReddy18/AI-health-chatbot" alt="Contributors" />
  </a>
</p>

See the full list of contributors and their contributions on the [`GitHub Contributors Graph`](https://github.com/CharithaReddy18/AI-health-chatbot/graphs/contributors).

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 align="center">
<p style="font-family:var(--ff-philosopher);font-size:3rem;"><b> Show some <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" alt="Red Heart" width="40" height="40" /> by starring this awesome repository!
</p>
</h2>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="suggestions-feedback">💡 Suggestions & Feedback</h2>

Feel free to open issues or discussions if you have any feedback, feature suggestions, or want to collaborate!

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="show-your-support">🙌 Show Your Support</h2>

*If you find AI-health-chatbot project helpful, give it a star! ⭐ to support more such educational initiatives:*

- ⭐ **Starring the repository**
- 🐦 **Sharing on social media**
- 💬 **Telling your friends and colleagues**
- 🤝 **Contributing to the project**

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="license">📄 License</h2>

This project is licensed under the MIT License - see the [`License`](https://github.com/CharithaReddy18/AI-health-chatbot/blob/main/LICENSE) file for details.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="stargazers">⭐ Stargazers</h2>

<div align="center">
  <a href="https://github.com/CharithaReddy18/AI-health-chatbot/stargazers">
    <img src="https://reporoster.com/stars/CharithaReddy18/AI-health-chatbot?type=svg&limit=100&names=false" alt="Stargazers" />
  </a>
</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="forkers">🍴 Forkers</h2>

<div align="center">
  <a href="https://github.com/CharithaReddy18/AI-health-chatbot/members">
    <img src="https://reporoster.com/forks/CharithaReddy18/AI-health-chatbot?type=svg&limit=100&names=false" alt="Forkers" />
  </a>
</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 id="project-admin" align="center">🧑‍💻Project Admin:</h2>
<table>
<tr>
<td align="center">
<a href="https://github.com/CharithaReddy18"><img src="https://avatars.githubusercontent.com/u/181075868?v=4" height="140px" width="140px" alt="Nayini Charitha Reddy"></a><br><sub><b>Nayini Charitha Reddy</b><br><a href="https://www.linkedin.com/in/charithareddy18/"><img src="https://github-production-user-asset-6210df.s3.amazonaws.com/73993775/278833250-adb040ea-e3ef-446e-bcd4-3e8d7d4c0176.png" width="45px" height="45px"></a>
</sub>
</td>
</tr>
</table>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h2 align="center">👨‍🏫Mentors – AI-health-chatbot (GSSoC'25)</h2>

| Role          | Name               | GitHub Profile                                      | LinkedIn Profile                                                        |
| ------------- | ------------------ | --------------------------------------------------- | ----------------------------------------------------------------------- |
| Mentor 1 | Anshi Agarwal | [anshiagrawal22](https://github.com/anshiagrawal22)  | [anshiagrawal22](https://www.linkedin.com/in/anshiagrawal22/) |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h1 align="center"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" alt="Glowing Star" width="25" height="25" /> Give us a Star and let's make magic! <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" alt="Glowing Star" width="25" height="25" /></h1>

<p align="center">
     <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Mirror%20Ball.png" alt="Mirror Ball" width="150" height="150" />
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<h3 align="center"> 👨‍💻 Built with ❤️ by AI-health-chatbot Team</h3>
<h4 align="center"> ❤️ Nayini Charitha Reddy and Contributors ❤️ </h4>
<p align="center">
  <a href="https://github.com/CharithaReddy18/AI-health-chatbot/issues">Open an Issue</a> | <a href="https://github.com/CharithaReddy18/AI-health-chatbot">🌟 Star on GitHub</a>
 </p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=65&section=footer"/>

<p align="center">
  <a href="#top" style="font-size: 18px; padding: 8px 16px; display: inline-block; border: 1px solid #ccc; border-radius: 6px; text-decoration: none;">
    ⬆️ Back to Top
  </a>
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

> Ready to show off your coding achievements? Get started with **AI-health-chatbot** today! 🚀

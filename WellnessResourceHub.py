import streamlit as st
import random

st.set_page_config(page_title="Wellness Resource Hub", layout="wide")

# --- Sidebar Navigation ---
st.sidebar.title("🌿 Wellness Hub Menu")
page = st.sidebar.radio(
    "Go to:",
    [
        "🏠 Wellness Hub",
        "🌞 Daily Affirmation",
        "✅ Quick Self-Check",
        "📅 Daily Planner",
        "📊 Mood Tracker",
        "📚 Wellness Resources"
    ]
)

# --- Wellness categories ---
categories = {
    "🧘 Mind": [
        "Practice meditation for 5 minutes daily",
        "Try journaling your thoughts",
        "Use apps like Headspace or Calm"
    ],
    "💪 Body": [
        "Do at least 20 minutes of exercise",
        "Simple stretches help reduce stiffness",
        "Stay hydrated while being active"
    ],
    "🥗 Nutrition": [
        "Eat balanced meals with protein, carbs, and veggies",
        "Drink at least 7–8 glasses of water daily",
        "Avoid too much junk food"
    ],
    "😴 Sleep": [
        "Aim for 7–8 hours of sleep daily",
        "Avoid screen time 30 mins before bed",
        "Keep a consistent sleep schedule"
    ],
    "🌸 Stress Relief": [
        "Try deep breathing (inhale 4s, hold 4s, exhale 4s)",
        "Listen to calming music",
        "Take short breaks while working"
    ]
}

# --- Motivational Affirmations ---
affirmations = [
    "✨ You are stronger than you think.",
    "🌞 Small steps every day lead to big changes.",
    "🌸 Prioritize your well-being — you deserve it.",
    "💡 Every day is a new beginning — take a deep breath and start fresh."
]

# --- Page 1: Wellness Hub ---
if page == "🏠 Wellness Hub":
    st.title("🌿 Wellness Resource Hub")
    st.write("Click on a category to explore simple wellness tips and resources.")

    col1, col2 = st.columns(2)

    with col1:
        if st.button("🧘 Mind"):
            st.subheader("🧘 Mind Tips")
            for tip in categories["🧘 Mind"]:
                st.write("- " + tip)

        if st.button("🥗 Nutrition"):
            st.subheader("🥗 Nutrition Tips")
            for tip in categories["🥗 Nutrition"]:
                st.write("- " + tip)

        if st.button("🌸 Stress Relief"):
            st.subheader("🌸 Stress Relief Tips")
            for tip in categories["🌸 Stress Relief"]:
                st.write("- " + tip)

    with col2:
        if st.button("💪 Body"):
            st.subheader("💪 Body Tips")
            for tip in categories["💪 Body"]:
                st.write("- " + tip)

        if st.button("😴 Sleep"):
            st.subheader("😴 Sleep Tips")
            for tip in categories["😴 Sleep"]:
                st.write("- " + tip)

    st.markdown("---")
    st.success(random.choice(affirmations))

# --- Page 2: Daily Affirmation ---
elif page == "📊 Mood Tracker":
    import pandas as pd
    import datetime

    st.title("📊 Mood Tracker")
    st.write("Log your daily mood, track progress, and download history.")

    # Initialize session state
    if "moods" not in st.session_state:
        st.session_state.moods = []

    # Log today's mood
    today = datetime.date.today()
    mood = st.radio("How do you feel today?", ["😊 Happy", "😐 Okay", "😟 Stressed", "😢 Sad"])
    if st.button("Log Mood"):
        st.session_state.moods.append({"date": str(today), "mood": mood})
        st.success(f"Logged mood: {mood}")

    # Display mood history
    if st.session_state.moods:
        df = pd.DataFrame(st.session_state.moods)
        st.subheader("📅 Mood History")
        st.table(df)

        # Map moods to numbers for plotting
        mood_map = {"😊 Happy": 4, "😐 Okay": 3, "😟 Stressed": 2, "😢 Sad": 1}
        df["mood_num"] = df["mood"].map(mood_map)
        st.subheader("📈 Mood Trend")
        st.line_chart(df.set_index("date")["mood_num"])

        # Export CSV
        csv = df.to_csv(index=False).encode("utf-8")
        st.download_button("⬇️ Download Mood History", csv, "mood_history.csv", "text/csv")
    else:
        st.info("No moods logged yet.")

# --- Page 6: Wellness Resources ---
elif page == "📚 Wellness Resources":
    st.title("📚 Wellness Resources")
    st.write("Here are some trusted resources to explore:")

    st.markdown("[🧘 Headspace – Meditation & Mindfulness](https://www.headspace.com/)")
    st.markdown("[💪 Nike Training Club – Free Workout App](https://www.nike.com/ntc-app)")
    st.markdown("[🥗 Nutrition.gov – Healthy Eating Guide](https://www.nutrition.gov/)")
    st.markdown("[😴 Sleep Foundation – Sleep Health](https://www.sleepfoundation.org/)")
    st.markdown("[🌸 Calm – Stress & Relaxation](https://www.calm.com/)")
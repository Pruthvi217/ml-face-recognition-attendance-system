from flask import Flask, render_template, request
import pandas as pd
import os
import glob

app = Flask(__name__)

# Paths
STUDENT_DETAILS_PATH = "./StudentDetails/studentdetails.csv"
ATTENDANCE_FOLDER = "./Attendance"

@app.route("/")
def home():
    if os.path.exists(STUDENT_DETAILS_PATH):
        students_df = pd.read_csv(STUDENT_DETAILS_PATH)
    else:
        students_df = pd.DataFrame(columns=["Enrollment", "Name"])

    attendance_files = glob.glob(os.path.join(ATTENDANCE_FOLDER, "*.csv"))
    subjects = [os.path.basename(f).replace(".csv", "") for f in attendance_files]

    return render_template("index.html", subjects=subjects, students=students_df.to_dict(orient="records"))


@app.route("/subject/<subject_name>")
def view_subject(subject_name):
    file_path = os.path.join(ATTENDANCE_FOLDER, f"{subject_name}.csv")
    if not os.path.exists(file_path):
        return f"<h3>No attendance data found for {subject_name}</h3><a href='/'>Go back</a>"

    df = pd.read_csv(file_path)
    return render_template("subject.html", subject=subject_name, table=df.to_html(classes='table table-striped', index=False))


@app.route("/student/<int:enrollment>")
def view_student(enrollment):
    student_name = None
    if os.path.exists(STUDENT_DETAILS_PATH):
        df_students = pd.read_csv(STUDENT_DETAILS_PATH)
        student = df_students[df_students["Enrollment"] == enrollment]
        if not student.empty:
            student_name = student.iloc[0]["Name"]

    attendance_files = glob.glob(os.path.join(ATTENDANCE_FOLDER, "*.csv"))
    records = []

    for f in attendance_files:
        subject = os.path.basename(f).replace(".csv", "")
        df = pd.read_csv(f)
        if enrollment in df["Enrollment"].values:
            row = df[df["Enrollment"] == enrollment].iloc[0]
            records.append({
                "Subject": subject,
                "Date": row.get("Date", "Unknown"),
                "Status": row.get("Status", "Present")
            })

    return render_template("student.html", student_name=student_name, enrollment=enrollment, records=records)


if __name__ == "__main__":
    app.run(debug=True)

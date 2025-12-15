import tkinter as tk
from tkinter import *
import os
import cv2
import csv
import numpy as np
from PIL import ImageTk, Image
import pandas as pd
import datetime
import time
import tkinter.ttk as ttk
import tkinter.font as font

haarcasecade_path = "haarcascade_frontalface_default.xml"
trainimagelabel_path = "TrainingImageLabel/Trainner.yml"
trainimage_path = "TrainingImage"
studentdetail_path = "StudentDetails/studentdetails.csv"
attendance_path = "Attendance"


# ------------------------------------------------------------------
# SUBJECT CHOOSE  +  ATTENDANCE FILLER
# ------------------------------------------------------------------
def subjectChoose(text_to_speech):

    def FillAttendance():
        sub = tx.get().strip()

        if sub == "":
            t = "Please enter subject name!"
            text_to_speech(t)
            return

        try:
            # ------------------ Load Recognizer -----------------------
            recognizer = cv2.face.LBPHFaceRecognizer_create()
            try:
                recognizer.read(trainimagelabel_path)
            except:
                e = "Model not found. Please train the model first."
                Notifica.configure(text=e, bg="black", fg="yellow")
                text_to_speech(e)
                return

            faceCascade = cv2.CascadeClassifier(haarcasecade_path)

            df = pd.read_csv(studentdetail_path)

            # ------------------ Open Webcam ---------------------------
            cam = cv2.VideoCapture(0, cv2.CAP_MSMF)

            if not cam.isOpened():
                text_to_speech("Camera not opening. Check permissions.")
                print("❌ Camera failed to open")
                return

            cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            time.sleep(1)

            print("🎥 Camera warmed up and ready.")

            attendance = pd.DataFrame(columns=["Enrollment", "Name"])

            start_time = time.time()
            end_time = start_time + 20  # 20 sec scan window

            while True:
                ret, img = cam.read()
                if not ret:
                    continue

                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                faces = faceCascade.detectMultiScale(gray, 1.2, 5)

                for (x, y, w, h) in faces:
                    Id, conf = recognizer.predict(gray[y:y+h, x:x+w])

                    if conf < 70:
                        name = df.loc[df["Enrollment"] == Id]["Name"].values[0]

                        attendance.loc[len(attendance)] = [Id, name]

                        cv2.putText(
                            img,
                            f"{Id} - {name}",
                            (x, y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (0, 255, 0),
                            2,
                        )
                        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 3)

                    else:
                        cv2.putText(
                            img,
                            "Unknown",
                            (x, y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (0, 0, 255),
                            2,
                        )
                        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 3)

                cv2.imshow("Filling Attendance...", img)

                if time.time() > end_time:
                    break

                if cv2.waitKey(1) == 27:  # ESC
                    break

            cam.release()
            cv2.destroyAllWindows()

            attendance = attendance.drop_duplicates(["Enrollment"], keep="first")

            # ------------------ Save Attendance CSV -------------------
            ts = datetime.datetime.now()
            date = ts.strftime("%Y-%m-%d")
            timeStamp = ts.strftime("%H-%M-%S")

            folder = os.path.join(attendance_path, sub)
            os.makedirs(folder, exist_ok=True)

            fileName = f"{folder}/{sub}_{date}_{timeStamp}.csv"

            attendance.to_csv(fileName, index=False)
            print(attendance)

            msg = f"Attendance Filled Successfully for {sub}"
            Notifica.configure(text=msg, bg="black", fg="yellow")
            text_to_speech(msg)

            # ------------------ SHOW CSV IN TKINTER -------------------
            show_csv_window(fileName, sub)

        except Exception as e:
            print("ERROR:", e)
            text_to_speech("Error occurred while taking attendance.")
            cv2.destroyAllWindows()


    # ------------------------------------------------------------------
    # Show Attendance Sheet Window
    # ------------------------------------------------------------------
    def show_csv_window(path, subject):
        root = Tk()
        root.title(f"Attendance Sheet - {subject}")
        root.configure(background="black")

        with open(path, newline="") as file:
            reader = csv.reader(file)
            r = 0
            for col in reader:
                c = 0
                for row in col:
                    label = Label(
                        root,
                        width=15,
                        height=1,
                        fg="yellow",
                        bg="black",
                        font=("times", 15, "bold"),
                        text=row,
                        relief=RIDGE,
                    )
                    label.grid(row=r, column=c)
                    c += 1
                r += 1

        root.mainloop()


    # ---------------------------------------------------------------
    # GUI WINDOW
    # ---------------------------------------------------------------
    subject = Tk()
    subject.title("Subject Selection")
    subject.geometry("580x320")
    subject.configure(background="black")
    subject.resizable(0, 0)

    title = Label(subject, text="Enter Subject Name", bg="black", fg="green", font=("arial", 25))
    title.pack(pady=20)

    Notifica = Label(subject, text="", bg="black", fg="yellow", font=("times", 15, "bold"))

    Label(subject, text="Subject:", bg="black", fg="yellow", font=("times new roman", 18)).place(x=60, y=120)
    tx = Entry(subject, width=15, bd=5, bg="black", fg="yellow", font=("times", 25, "bold"))
    tx.place(x=200, y=120)

    Button(subject, text="Fill Attendance", command=FillAttendance, bg="black", fg="yellow",
           font=("times new roman", 15), bd=7, width=15).place(x=200, y=180)

    def open_folder():
        sub = tx.get().strip()
        if sub == "":
            text_to_speech("Enter subject name first!")
        else:
            os.startfile(f"Attendance/{sub}")

    Button(subject, text="Open Sheets", command=open_folder,
           bg="black", fg="yellow", font=("times new roman", 15), bd=7,
           width=15).place(x=200, y=240)

    subject.mainloop()

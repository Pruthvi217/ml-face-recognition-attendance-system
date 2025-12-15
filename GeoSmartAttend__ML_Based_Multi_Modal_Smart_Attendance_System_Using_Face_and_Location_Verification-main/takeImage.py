import csv
import os
import cv2
import numpy as np
import pandas as pd
import datetime
import time


def TakeImage(l1, l2, haarcasecade_path, trainimage_path, message, err_screen, text_to_speech):

    # Validate user input
    if l1 == "" and l2 == "":
        text_to_speech("Please enter your Enrollment Number and Name.")
        return
    if l1 == "":
        text_to_speech("Please enter your Enrollment Number.")
        return
    if l2 == "":
        text_to_speech("Please enter your Name.")
        return

    try:
        # Open webcam
        cam = cv2.VideoCapture(0, cv2.CAP_MSMF)   # More stable on Windows
        if not cam.isOpened():
            text_to_speech("❌ Webcam not opening. Please check camera permissions.")
            print("ERROR: Camera failed to open.")
            return

        cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        time.sleep(1)
        print("Camera warmed up and ready.")

        detector = cv2.CascadeClassifier(haarcasecade_path)
        Enrollment = l1
        Name = l2
        sampleNum = 0

        # Create directory for the student's images
        directory = f"{Enrollment}_{Name}"
        path = os.path.join(trainimage_path, directory)
        os.makedirs(path, exist_ok=True)

        while True:
            ret, img = cam.read()

            if not ret:
                print("Frame not captured.")
                continue

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = detector.detectMultiScale(gray, 1.3, 5)

            for (x, y, w, h) in faces:
                cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
                sampleNum += 1

                # Save image correctly
                filename = f"{path}/{Name}_{Enrollment}_{sampleNum}.jpg"
                cv2.imwrite(filename, gray[y:y+h, x:x+w])

                print("Saved:", filename)
                cv2.imshow("Frame", img)

            # Quit OR enough samples
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
            if sampleNum >= 50:
                break

        cam.release()
        cv2.destroyAllWindows()

        # Save student details
        with open("StudentDetails/studentdetails.csv", "a+", newline="") as csvFile:
            writer = csv.writer(csvFile)
            writer.writerow([Enrollment, Name])

        res = f"Images Saved for Enrollment: {Enrollment}, Name: {Name}"
        message.configure(text=res)
        text_to_speech(res)

    except Exception as e:
        print("ERROR:", e)
        text_to_speech("An error occurred while capturing images.")

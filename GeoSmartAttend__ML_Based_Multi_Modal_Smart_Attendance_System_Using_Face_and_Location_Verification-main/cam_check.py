import cv2

print("🔍 Checking camera feeds... Press 'q' to quit.")

for i in range(5):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"✅ Camera {i} opened successfully.")
        while True:
            ret, frame = cap.read()
            if not ret:
                print(f"⚠️ Camera {i} detected but no frame captured.")
                break
            cv2.imshow(f"Camera {i} - Press 'q' to close", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()
    else:
        print(f"❌ Camera {i} not found or busy.")

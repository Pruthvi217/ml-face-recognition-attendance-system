# =============================================
# ✅ location.py — Verify location first, then launch attendance.py
# =============================================

import geocoder
from geopy.distance import geodesic
from tkinter import messagebox, Tk
import subprocess
import sys
import io

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Allowed locations (you can add more if needed)
allowed_locations = {
    "Home": (12.9719, 77.5937),
    "Bommanahalli": (9.3559, 77.9246)
}

allowed_radius_km = 10  # radius in kilometers


def verify_location():
    try:
        g = geocoder.ip("me")
        if not g.ok or g.latlng is None:
            root = Tk()
            root.withdraw()
            messagebox.showerror("Error", "⚠️ Unable to detect location. Check your internet connection.")
            root.destroy()
            return False

        current_location = tuple(g.latlng)
        print(f"Current Location: {current_location}")

        for place, coords in allowed_locations.items():
            distance = geodesic(current_location, coords).km
            if distance <= allowed_radius_km:
                root = Tk()
                root.withdraw()
                messagebox.showinfo("Access Granted", f"✅ You are within {distance:.2f} km of {place}.")
                root.destroy()
                return True

        root = Tk()
        root.withdraw()
        messagebox.showerror("Access Denied", "❌ You are outside the allowed 10 km range.")
        root.destroy()
        return False

    except Exception as e:
        root = Tk()
        root.withdraw()
        messagebox.showerror("Error", f"⚠️ Location verification failed:\n{e}")
        root.destroy()
        return False


if __name__ == "__main__":
    if verify_location():
        print("Location verified. Launching attendance system...")
        try:
            # Automatically run attendance.py
            subprocess.run([sys.executable, "attendance.py"])
        except Exception as e:
            print(f"Error running attendance.py: {e}")
    else:
        print("Access Denied. Attendance system not launched.")

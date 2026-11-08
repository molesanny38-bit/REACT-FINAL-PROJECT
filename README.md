# Find It — IT Department Lost & Found Management System

**Find It** is a specialized lost-and-found coordination and verification web platform designed exclusively for the **Information Technology (IT) Department**.

---

## 🏢 IT Department Spaces & Facilities Covered

* **Department Office:** Station of the *Department Head*, *Department Secretary*, and *Faculty Instructors*.
* **Computer Laboratories:**
  * `LAB 42` (Programming & Web Development)
  * `LAB 43` (Cisco & Networking Systems)
  * `LAB 44` (Multimedia & Databases)
  * `LAB 45` (Systems Analysis & Capstone)
* **Lecture Rooms:**
  * `Room 46`
  * `Room 47`
  * `Room 48`
  * `Room 49`

---

## 👥 The 3 System Roles (Simplified & Unified)

1. 🎓 **Student Choice:**
   * **Target Audience:** All enrolled IT students taking classes in Labs 42–45 and Rooms 46–49.
   * **Capabilities:** Search lost & found articles by specific lab/room, report missing items, and claim found items by submitting secret identifying proof.
   * **Digital Pickup Pass:** Claims generate a unique PIN (e.g. `FIT-4201`) to present to a verifier.

2. 🛡️ **Department Verifier Choice (Unified for all persons authorized to verify):**
   * **Target Audience:** Instructors (Faculty), Student Officers (IT Society / Council), Department Head, and Secretary.
   * **Capabilities:**
     * **Claim Verification Queue:** Inspect student proofs against confidential intake notes.
     * **Approve / Decline Claims:** Authorize physical handovers.
     * **Handover Code Terminal:** Enter/scan student PINs to confirm handovers and mark items as returned.
     * **Department Inventory:** Track objects stored in the Department Office safe and lab drawers.

3. ⚡ **Admin Choice:**
   * **Target Audience:** IT Systems Administrator.
   * **Capabilities:** Master cross-space audit logs, facility management, and retention policy settings.

---

## 🚀 How to Run the App

1. Open your terminal in the `client` folder:
   ```bash
   cd client
   npm install
   npm run dev
   ```
2. Open **`http://localhost:3000`** in your browser.

---

## ⚡ 1-Click Auto-Fill Demo Credentials

On the login screen, click **"Auto-fill Credentials"** to test any role:
* **Student:** `s.chen@student.it.edu` / `StudentPass2026!` *(Sophia Chen, BSIT 3-A)*
* **Verifier (Instructor):** `m.davis@it.campus.edu` / `InstructorPass2026!` *(Prof. Marc Davis)*
* **Verifier (Student Officer):** `c.reyes@student.it.edu` / `OfficerPass2026!` *(Christian Reyes, IT Society VP)*
* **Verifier (Dept Office):** `secretary@it.campus.edu` / `OfficePass2026!` *(Ms. Karen Diaz, Secretary)*
* **Admin:** `admin@it.campus.edu` / `MasterAdmin2026!` *(IT System Administrator)*

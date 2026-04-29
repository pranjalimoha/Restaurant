import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();

  const [profile, setProfile] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "reservations">("profile");

  useEffect(() => {
    const fetchData = async () => {
      const savedToken = token || localStorage.getItem("token");

      if (!savedToken) {
        navigate("/login");
        return;
      }

      // profile
      const p = await fetch("http://localhost:5001/api/users/profile", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      const pd = await p.json();
      setProfile(pd.data);

      // reservations
      const r = await fetch("http://localhost:5001/api/users/reservations", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      const rd = await r.json();
      setReservations(rd.data || []);
    };

    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Welcome back, {profile.name}!</h1>
          <p className={styles.diner}>Preferred Diner #: {profile.preferred_diner_number}</p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.pointsBox}>
            <p>Loyalty Points</p>
            <h2>{profile.earned_points}</h2>
          </div>

          <p className={styles.pointsNote}>Earn 1 point for every $1 spent</p>

          <button onClick={handleLogout} className={styles.logout}>
            Logout
          </button>
        </div>
      </div>

      {/* CTA */}
      <button className={styles.cta} onClick={() => navigate("/reservation")}>
        + Make a New Reservation
      </button>

      {/* CARD */}
      <div className={styles.card}>
        {/* TABS */}
        <div className={styles.tabs}>
          <button
            className={activeTab === "profile" ? styles.active : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button
            className={activeTab === "reservations" ? styles.active : ""}
            onClick={() => setActiveTab("reservations")}
          >
            My Reservations
          </button>
        </div>

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className={styles.profileGrid}>
            <div>
              <label>Name</label>
              <p>{profile.name}</p>
            </div>

            <div>
              <label>Email</label>
              <p>{profile.email}</p>
            </div>

            <div>
              <label>Phone</label>
              <p>{profile.phone}</p>
            </div>

            <div>
              <label>Preferred Payment</label>
              <p>{profile.preferred_payment_method}</p>
            </div>

            <div>
              <label>Mailing Address</label>
              <p>{profile.mailing_address || "N/A"}</p>
            </div>

            <div>
              <label>Billing Address</label>
              <p>
                {profile.billing_same_as_mailing
                  ? "Same as mailing"
                  : profile.billing_address || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* RESERVATIONS */}
        {activeTab === "reservations" && (
          <div>
            {reservations.length === 0 ? (
              <p className={styles.empty}>No reservations yet</p>
            ) : (
              reservations.map((r) => (
                <div key={r.id} className={styles.reservationCard}>
                  <span className={styles.status}>{r.status}</span>

                  <div className={styles.resGrid}>
                    <p>
                      <b>Date:</b> {r.reservation_date}
                    </p>
                    <p>
                      <b>Time:</b> {r.reservation_time}
                    </p>
                    <p>
                      <b>Guests:</b> {r.number_of_guests}
                    </p>
                    <p>
                      <b>Tables:</b>{" "}
                      {r.reservation_tables
                        ?.map((t: any) => t.restaurant_tables?.table_number)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

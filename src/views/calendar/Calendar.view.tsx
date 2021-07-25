import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./calendar.scss";
import styles from "./calendar.module.scss";
import { isSameDay } from "../../services/same-day";
import Modal from "react-modal";
import Toggle from "react-toggle";
import { Period, PeriodManager } from "../../services/periodManger";

Modal.setAppElement("#root");

export function CalendarView() {
    const [periods, setPeriods] = useState<Period[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [periodManager] = useState(() =>
        PeriodManager.create("period_manager")
    );

    const [modalOpen, setModalOpen] = useState(false);

    // hook to attach event handlers for periods
    useEffect(() => {
        const handlePeriodsChange = (periods: Period[]) => {
            const periodDates = periods.map((period) => ({ ...period }));
            setPeriods(periodDates);
        };
        periodManager.on("change", handlePeriodsChange);
        return () => {
            periodManager.off("change", handlePeriodsChange);
        };
    }, [periodManager]);

    const openModal = (date: Date) => {
        setSelectedDate(date);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedDate(undefined);
        setModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <Calendar
                onChange={(selectedDate: Date) => {
                    return openModal(selectedDate);
                }}
                value={new Date()}
                tileClassName={({ date, view }) => {
                    if (view === "month") {
                        const match = periods.some((period) =>
                            isSameDay(date, period.date)
                        );
                        return match ? styles.periods : "";
                    }
                    return "";
                }}
            />
            {selectedDate && (
                <Modal
                    isOpen={modalOpen}
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.card}>
                        <div className={styles.body}>
                            <label className={styles.dateToggle_container}>
                                <span className={styles.label}>{`${new Date(
                                    selectedDate
                                ).getDay()}-${
                                    new Date(selectedDate).getMonth() + 1
                                }-${new Date(
                                    selectedDate
                                ).getFullYear()}`}</span>
                                <Toggle
                                    className={styles.toggle}
                                    defaultChecked={periods.some((period) =>
                                        isSameDay(selectedDate, period.date)
                                    )}
                                    onChange={(e) => {
                                        const selected = e.target.checked;

                                        if (selected) {
                                            periodManager.addPeriod(
                                                selectedDate,
                                                ""
                                            );
                                        } else {
                                            periodManager.removePeriod(
                                                selectedDate
                                            );
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className={styles.actions}>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

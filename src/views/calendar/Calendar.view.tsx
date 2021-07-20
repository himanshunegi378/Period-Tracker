import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./calendar.scss";
import styles from "./calendar.module.scss";
import { isSameDay } from "./services/same-day";
import { storage } from "../../services/storage";
import Modal from "react-modal";
import Toggle from "react-toggle";

Modal.setAppElement("#root");

const PERIOD_DATES_STORAGE_KEY = "PERIOD_DATES";
export function CalendarView() {
    const [periodDates, setPeriodDates] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>();

    const [modalOpen, setModalOpen] = useState(false);

    // get period dates from storage on first mount
    useEffect(() => {
        storage.load<Date[]>(PERIOD_DATES_STORAGE_KEY).then((dates) => {
            if (dates) {
                setPeriodDates(dates);
            }
        });
    }, []);

    //save period dates to storage everytime the period dates change
    useEffect(() => {
        storage.save(PERIOD_DATES_STORAGE_KEY, periodDates);
    }, [periodDates]);

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
                        const match = periodDates.some((_date) =>
                            isSameDay(date, _date)
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
                                    defaultChecked={periodDates.some((_dates) =>
                                        isSameDay(selectedDate, _dates)
                                    )}
                                    onChange={(e) => {
                                        const selected = e.target.checked;
                                        if (selected) {
                                            setPeriodDates([
                                                ...periodDates,
                                                selectedDate
                                            ]);
                                        } else {
                                            setPeriodDates(
                                                periodDates.filter(
                                                    (_date) =>
                                                        !isSameDay(
                                                            _date,
                                                            selectedDate
                                                        )
                                                )
                                            );
                                        }
                                    }}
                                    // onChange={this.handleAubergineChange}
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

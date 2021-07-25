import React, { useEffect, useState } from "react";
import { Period, PeriodManager } from "../../services/periodManger";

export function Stats() {
    const [periods, setPeriods] = useState<Period[]>([]);
    const [periodManager] = useState(() =>
        PeriodManager.create("period_manager")
    );
    // hook to attach event handlers for periods
    useEffect(() => {
        const handlePeriodsChange = (periods: Period[]) => {
            const periodDates = periods.map((period) => ({ ...period }));
            periodDates.sort((a, b) => a.date.getTime() - b.date.getTime());
            setPeriods(periodDates);
        };
        periodManager.on("change", handlePeriodsChange);
        return () => {
            periodManager.off("change", handlePeriodsChange);
        };
    }, [periodManager]);

    const periodListJsx = periods.map((period) => {
        return (
            <div key={period.date.toString()}>
                <li>{period.date.toDateString()}</li>
            </div>
        );
    });

    return (
        <div>
            <ul>{periodListJsx}</ul>
        </div>
    );
}

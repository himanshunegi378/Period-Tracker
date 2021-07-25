import { isSameDay } from "./same-day";
import EventEmitter from "events";
import { storage } from "./storage";

export type Period = {
    date: Date;
    remark: string;
};

// A class that manages the period objects
export class PeriodManager extends EventEmitter {
    private periods: Period[];
    private id: string;
    constructor(managerId: string) {
        super();
        this.periods = [];
        this.id = managerId;
        this.loadPeriodsFromStorage(this.id).then((periods) => {
            if (periods) {
                this.periods = periods;
                this.emitChange();
            }
        });
    }

    private emitChange() {
        this.savePeriodsToStorage(this.periods);
        this.emit("change", this.periods);
    }

    // load periods array from the storage and add it to periods array
    private loadPeriodsFromStorage(id: string) {
        return storage.load<Period[]>(id);
    }

    // save periods array to storage
    public savePeriodsToStorage(periods: Period[]): void {
        storage.save(this.id, periods);
    }

    // Adds a period to the manager
    public addPeriod(date: Date, remark: string): void {
        // get period for the date if present
        let existingPeriod = this.getPeriod(date);
        // if period is not present
        // - create a new period and add to the list otherwise update the existing period
        if (!existingPeriod) {
            let newPeriod = {
                date: date,
                remark: remark
            };
            this.periods.push(newPeriod);
            this.emitChange();
        } else {
            existingPeriod.remark = remark;
            this.emitChange();
        }
    }

    // update the period remark
    public updatePeriod(date: Date, remark: string): void {
        let period = this.getPeriod(date);
        if (period) {
            period.remark = remark;
            this.emitChange();
        }
    }

    // remove period from the manager if exists
    public removePeriod(date: Date): void {
        let period = this.getPeriod(date);
        if (period) {
            this.periods.splice(this.periods.indexOf(period), 1);
            this.emitChange();
        }
    }

    // Returns the period by the date else return null
    public getPeriod(date: Date): Period | null {
        let period: Period | null = null;
        this.periods.forEach((p) => {
            if (isSameDay(p.date, date)) {
                period = p;
            }
        });
        return period;
    }

    // Returns the periods array
    public getPeriods(): Period[] {
        return this.periods;
    }

    // create an instance of the PeriodManager
    public static create(id: string): PeriodManager {
        return new PeriodManager(id);
    }
}

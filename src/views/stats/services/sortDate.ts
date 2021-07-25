// function to sort the array of dates without mutating it
export function sortDates(dates: Date[]) {
    // copy array
    let sortedDates = dates.slice();
    // sort the array
    sortedDates.sort(function (a, b) {
        return a.getTime() - b.getTime();
    });
    return sortedDates;
}

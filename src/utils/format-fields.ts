export class FormatFields {
    public dateToString(date: Date) {
        console.log(date.toISOString().split('T')[0])
        return date.toISOString().split('T')[0];
    }
}
export class FormatFields {
    public dateToString(date: Date) {
        let convert = new Date(date);
        return convert.toISOString().split('T')[0];
    }
}
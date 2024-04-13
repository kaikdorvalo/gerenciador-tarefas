export class FormatFields {
    public dateToString(date: Date) {
        let convert = new Date(date);
        console.log(convert.toISOString().split('T')[0])
        return convert.toISOString().split('T')[0];
    }
}
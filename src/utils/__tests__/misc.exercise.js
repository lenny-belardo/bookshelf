import { formatDate } from "utils/misc"

test('should return the formatted date', () => {
    expect(formatDate(new Date('10 March'))).toEqual('Mar 01')
})

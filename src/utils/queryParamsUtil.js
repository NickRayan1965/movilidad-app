export class QueryParams {
  static bool(booleanValue) {
    const map = {
      'undefined': false,
      '0': false,
      '' : false,
      'null': false,
      'true': true,
      '1': true
    };
    return map[booleanValue] ?? Boolean(booleanValue);
  }
}
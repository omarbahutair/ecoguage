import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

export function ExposeId(): PropertyDecorator {
  return (target, propertyKey) => {
    Expose()(target, propertyKey);
    Transform(({ obj, value }) => {
      if (obj[propertyKey] instanceof Types.ObjectId) {
        return obj[propertyKey].toString();
      }
      if (
        obj[propertyKey] instanceof Array &&
        obj[propertyKey][0] instanceof Types.ObjectId
      ) {
        return obj[propertyKey].map((v: Types.ObjectId) => v.toString());
      }

      return value;
    })(target, propertyKey);
  };
}

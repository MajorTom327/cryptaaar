import { customType } from "drizzle-orm/pg-core";
import { TypeID } from "typeid-js";

export const Id = <TData extends string>(name: string) => {
  return customType<{ data: TypeID<TData>; driverData: string }>({
    dataType() {
      return "text";
    },
    toDriver(value: TypeID<TData>): string {
      return value.toString();
    },
    fromDriver(value: string): TypeID<TData> {
      return TypeID.fromString(value);
    },
  })(name);
};

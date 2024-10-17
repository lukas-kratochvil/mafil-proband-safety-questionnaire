import type { InferType, Schema } from "yup";

const load = async <TSchema extends Schema<object>>(schema: TSchema): Promise<InferType<TSchema>> => {
  const response = await fetch("/config.json");
  const data = await response.json();
  return schema.validate(data);
};

export default load;

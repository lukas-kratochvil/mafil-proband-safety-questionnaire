import type { InferType, SchemaOf } from "yup";

const load = async <TSchema extends SchemaOf<unknown>>(schema: TSchema): Promise<InferType<TSchema>> => {
  const response = await fetch("/config.json");
  const data = await response.json();
  return schema.validate(data);
};

export default load;

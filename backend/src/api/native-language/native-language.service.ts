import { Injectable } from "@nestjs/common";
import nativeLanguages from "../../../assets/native-languages.json";
import { NativeLanguageEntity } from "./entities/native-language.entity";

@Injectable()
export class NativeLanguageService {
  // TODO: fetch from MAFILDB API using our OIDC service account
  async findAll(): Promise<NativeLanguageEntity[]> {
    return nativeLanguages;
  }
}

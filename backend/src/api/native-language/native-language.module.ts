import { Module } from "@nestjs/common";
import { NativeLanguageResolver } from "./native-language.resolver";
import { NativeLanguageService } from "./native-language.service";

@Module({
  providers: [NativeLanguageResolver, NativeLanguageService],
  exports: [NativeLanguageResolver],
})
export class NativeLanguageModule {}

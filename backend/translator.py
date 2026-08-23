from deep_translator import GoogleTranslator

def translate_text(text: str, source_lang: str = "en", target_lang: str = "en") -> str:
    if not text or target_lang == "en" or target_lang == source_lang:
        return text
    try:
        clean_target = target_lang.split("-")[0].lower()
        translated = GoogleTranslator(source=source_lang, target=clean_target).translate(text)
        return translated if translated else text
    except Exception as e:
        print(f"Translation error ({source_lang} -> {target_lang}): {e}")
        return text
// Translation cache to avoid re-translating the same text
const translationCache = new Map<string, string>()

export async function translateText(text: string, targetLang: string): Promise<string> {
  // If target language is English, return original text
  if (targetLang === 'en') {
    return text
  }

  // Check cache first
  const cacheKey = `${text}_${targetLang}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  try {
    // Using MyMemory Translation API (free, no API key required)
    const encodedText = encodeURIComponent(text)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang === 'fil' ? 'tl' : targetLang}`
    )

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText
      // Store in cache
      translationCache.set(cacheKey, translated)
      return translated
    }

    // If translation fails, return original text
    return text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

// Batch translate multiple texts
export async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'en') {
    return texts
  }

  const promises = texts.map(text => translateText(text, targetLang))
  return Promise.all(promises)
}

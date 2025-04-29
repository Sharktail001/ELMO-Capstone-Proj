// src/lib/savedArticles.ts
export const getSavedArticles = (): any[] => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem("savedArticles")
    return saved ? JSON.parse(saved) : []
  }
  
  export const saveArticle = (article: any) => {
    const saved = getSavedArticles()
    const alreadySaved = saved.some((a) => a.id === article.id)
    if (!alreadySaved) {
      saved.push(article)
      localStorage.setItem("savedArticles", JSON.stringify(saved))
    }
  }
  
  export const removeArticle = (articleId: string) => {
    const saved = getSavedArticles()
    const updated = saved.filter((a) => a.id !== articleId)
    localStorage.setItem("savedArticles", JSON.stringify(updated))
  }
  
  export const isArticleSaved = (articleId: string): boolean => {
    const saved = getSavedArticles()
    return saved.some((a) => a.id === articleId)
  }
  
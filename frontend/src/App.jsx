"use client"

import { useState, useEffect } from "react"
import { PlusIcon, PencilIcon, TrashIcon, TagIcon, CalendarIcon, FilterIcon, XIcon } from "lucide-react"
// Article type definition


// Initial sample articles
const initialArticles = [];

export default function BlogPlatform() {

  // State for articles and UI
  const [articles, setArticles] = useState(initialArticles)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    publishDate: new Date().toISOString().split("T")[0],
  })
  const [tagInput, setTagInput] = useState("")
  const [view, setView] = useState("list")

  // Filter state
  const [filterByDate, setFilterByDate] = useState("")
  const [filterByTag, setFilterByTag] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetch("http://localhost:3001/posts")
      .then(res => res.json())
      .then(data => {
        setArticles(data.data)
      })
      .catch(err => {
        console.log("Error fetching data", err);
      })
  }, [])

  // Get all unique tags from articles
  const allTags = Array.from(new Set(articles.flatMap((article) => article.tags)))

  // Filter articles based on date and tag
  const filteredArticles = articles.filter((article) => {
    const matchesDate = filterByDate ? article.publishDate === filterByDate : true
    const matchesTag = filterByTag ? article.tags.includes(filterByTag) : true
    return matchesDate && matchesTag
  })

  // Handle article selection
  const handleSelectArticle = (article) => {
    setSelectedArticle(article)
    setView("article")
  }

  // Handle creating a new article
  const handleCreateArticle = () => {
    setSelectedArticle(null)
    setIsEditing(false)
    setFormData({
      title: "",
      content: "",
      tags: [],
      publishDate: new Date().toISOString().split("T")[0],
    })
    setView("form")
  }

  // Handle editing an article
  const handleEditArticle = (article) => {
    setSelectedArticle(article)
    setIsEditing(true)
    setFormData({
      title: article.title,
      content: article.content,
      tags: article.tags,
      publishDate: article.publishDate,
    })
    setView("form")
  }

  // Handle deleting an article
  const handleDeleteArticle = (id) => {
    console.log(articles)
    fetch(`http://localhost:3001/posts/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then((data) => {
        const updatedArticle = articles.filter((article) => article.id !== id);
        setArticles( updatedArticle);
        setSelectedArticle(null);
        setView("list");
        console.log("article deleted", updatedArticle);
      })
      .then(()=> {
        window.location.reload();
      })
      .catch(err => {
        console.log("Error deleting article", err);
      })
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  // Handle removing a tag
  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Create excerpt from content
    const excerpt = formData.content.length > 150 ? `${formData.content.substring(0, 150)}...` : formData.content

    if (isEditing && selectedArticle) {
      // Update existing article
      const updatedArticle = {
        ...selectedArticle,
        ...formData,
        excerpt,
      }
      fetch(`http://localhost:3001/posts/${selectedArticle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedArticle),
      })
        .then(res => res.json())
        .then(data => {
          setArticles(articles.map((article) => (article.id === selectedArticle.id ? updatedArticle : article)));
          setSelectedArticle(updatedArticle);
          setView("article");
        })
        .catch(err => {
          console.log("Error updating article", err);
        })
    } else {
      // Create new article
      const newArticle = {
        ...formData,
        excerpt,
      };
      fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      })
        .then(res => res.json())
        .then(data => {
          setArticles([...articles, data.data]);
          setSelectedArticle(data.data);
          setView("article");
        })
        .catch(err => {
          console.log("Error creating article", err);
        });
    }
  }

  // Reset filters
  const resetFilters = () => {
    setFilterByDate("")
    setFilterByTag("")
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => setView("list")}>
              Personal Blog
            </h1>
            <button
              onClick={handleCreateArticle}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Article
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* List View */}
        {view === "list" && (
          <div>
            {/* Filters */}
            <div className="mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {showFilters && (
                <div className="mt-3 p-4 bg-white rounded-md shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Date
                    </label>
                    <input
                      type="date"
                      id="date-filter"
                      value={filterByDate}
                      onChange={(e) => setFilterByDate(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Tag
                    </label>
                    <select
                      id="tag-filter"
                      value={filterByTag}
                      onChange={(e) => setFilterByTag(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">All Tags</option>
                      {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-500 md:col-span-2"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Articles List */}
            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h2
                          className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-indigo-600"
                          onClick={() => handleSelectArticle(article)}
                        >
                          {article.title}
                        </h2>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="p-1 rounded-full text-gray-400 hover:text-indigo-600 focus:outline-none"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteArticle(article._id)
                            }}
                            className="p-1 rounded-full text-gray-400 hover:text-red-600 focus:outline-none"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(article.publishDate)}
                      </div>
                      <p className="mt-3 text-gray-600">{article.excerpt}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleSelectArticle(article)}
                        className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Read more →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles found matching your filters.</p>
                {(filterByDate || filterByTag) && (
                  <button
                    onClick={resetFilters}
                    className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Article View */}
        {view === "article" && selectedArticle && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">{selectedArticle.title}</h1>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditArticle(selectedArticle)}
                    className="p-1 rounded-full text-gray-400 hover:text-indigo-600 focus:outline-none"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(selectedArticle.id)}
                    className="p-1 rounded-full text-gray-400 hover:text-red-600 focus:outline-none"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDate(selectedArticle.publishDate)}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 prose prose-indigo max-w-none">
                {selectedArticle.content.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <button
                onClick={() => setView("list")}
                className="mt-8 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ← Back to Articles
              </button>
            </div>
          </div>
        )}

        {/* Form View */}
        {view === "form" && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditing ? "Edit Article" : "Create New Article"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    rows={10}
                    required
                    value={formData.content}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    id="publishDate"
                    required
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:text-indigo-600 focus:outline-none"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => (selectedArticle ? setView("article") : setView("list"))}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isEditing ? "Update Article" : "Publish Article"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


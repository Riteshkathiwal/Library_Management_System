import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import API_URLS from '../../config/ApiUrl';
import bookService from '../../services/bookService';

import { formValidator } from '../../utils/validation';

const CreateBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    author_id: '',
    category_id: '',
    publisher_id: '',
    publication_year: new Date().getFullYear(),
    quantity: 1,
    description: '',
    cover_image: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
          axiosInstance.get(API_URLS.AUTHORS),
          axiosInstance.get(API_URLS.CATEGORIES),
          axiosInstance.get(API_URLS.PUBLISHERS)
        ]);
        
        setAuthors(authorsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
        setPublishers(publishersRes.data.data || []);

        // If editing, fetch book details
        if (id) {
            const bookRes = await bookService.getById(id);
            const book = bookRes.data;
            setFormData({
                title: book.title,
                isbn: book.isbn,
                author_id: book.author_id?._id || book.author_id,
                category_id: book.category_id?._id || book.category_id,
                publisher_id: book.publisher_id?._id || book.publisher_id,
                publication_year: book.publication_year,
                quantity: book.quantity,
                description: book.description || '',
                cover_image: book.cover_image || ''
            });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (errors[name]) {
       setErrors(prev => ({
         ...prev,
         [name]: ''
       }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = formValidator.book(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (id) {
          await bookService.update(id, formData);
          toast.success('Book updated successfully');
      } else {
          await axiosInstance.post(API_URLS.BOOKS, formData);
          toast.success('Book created successfully');
      }
      navigate('/books');
    } catch (error) {
      console.error('Error saving book:', error);
      // specific error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h4 className="mb-0 fw-bold">{id ? 'Edit Book' : 'Add New Book'}</h4>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                {errors.title && <small className="text-danger">{errors.title}</small>}
              </div>
              
              <div className="col-md-6">
                <label className="form-label">ISBN</label>
                <input
                  type="text"
                  className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                />
                {errors.isbn && <small className="text-danger">{errors.isbn}</small>}
              </div>

              <div className="col-md-4">
                <label className="form-label">Author</label>
                <select
                  className={`form-select ${errors.author_id ? 'is-invalid' : ''}`}
                  name="author_id"
                  value={formData.author_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Author</option>
                  {authors.map(author => (
                    <option key={author._id} value={author._id}>{author.name}</option>
                  ))}
                </select>
                {errors.author_id && <small className="text-danger">{errors.author_id}</small>}
              </div>

              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select
                  className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
                {errors.category_id && <small className="text-danger">{errors.category_id}</small>}
              </div>

              <div className="col-md-4">
                <label className="form-label">Publisher</label>
                <select
                  className={`form-select ${errors.publisher_id ? 'is-invalid' : ''}`}
                  name="publisher_id"
                  value={formData.publisher_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Publisher</option>
                  {publishers.map(publisher => (
                    <option key={publisher._id} value={publisher._id}>{publisher.name}</option>
                  ))}
                </select>
                {errors.publisher_id && <small className="text-danger">{errors.publisher_id}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Publication Year</label>
                <input
                  type="number"
                  className={`form-control ${errors.publication_year ? 'is-invalid' : ''}`}
                  name="publication_year"
                  value={formData.publication_year}
                  onChange={handleChange}
                  min="1000"
                  max={new Date().getFullYear() + 1}
                />
                {errors.publication_year && <small className="text-danger">{errors.publication_year}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Number of Copies</label>
                <input
                  type="number"
                  className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
                {errors.quantity && <small className="text-danger">{errors.quantity}</small>}
              </div>

              <div className="col-12">
                <label className="form-label">Cover Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-12 mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-save me-2"></i>}
                  Save Book
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/books')}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBook;

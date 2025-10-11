'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, ValidationRule } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';

export default function ProductEditForm({ productId }: { productId: string }) {
  const { data: product, error } = useSWR(`/api/admin/products/${productId}`);
  const router = useRouter();

  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('Product updated successfully');
      router.push('/admin/products');
    }
  );

  // Add sizes field in generic type
  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm<Product & { sizes: string[] }>();
  const watchedCategory = watch('category');
  const watchedSizes = watch('sizes') || [];

  useEffect(() => {
    if (!product) return;
    setValue('name', product.name);
    setValue('slug', product.slug);
    setValue('price', product.price);
    setValue('image', product.image);
    setValue('category', product.category);
    setValue('brand', product.brand);
    setValue('countInStock', product.countInStock);
    setValue('description', product.description);
    setValue('sizes', product.sizes || []); // prefill sizes

    setShowCustomCategory(
      ![
        'SHIRTS', 'T-SHIRTS', 'TROUSERS', 'JEANS',
        'JACKETS', 'SWEATERS', 'HOODIES', 'SHORTS', 'Lehenga'
      ].includes(product.category)
    );
  }, [product, setValue]);

  const formSubmit = async (formData: any) => {
    if (!formData.image) return toast.error('Please upload an image before submitting');
    if (!formData.sizes || formData.sizes.length === 0) return toast.error('Please select at least one size');
    await updateProduct(formData);
  };

  const FormInput = ({ id, name, required, pattern }: { id: keyof Product; name: string; required?: boolean; pattern?: ValidationRule<RegExp>; }) => (
    <div className='mb-6 md:flex'>
      <label className='label md:w-1/5' htmlFor={id}>{name}</label>
      <div className='md:w-4/5'>
        <input
          type='text'
          id={id}
          {...register(id, { required: required && `${name} is required`, pattern })}
          className='input input-bordered w-full max-w-md'
        />
        {errors[id]?.message && <div className='text-error'>{errors[id]?.message}</div>}
      </div>
    </div>
  );

  const uploadHandler = async (e: any) => {
    const toastId = toast.loading('Uploading image...');
    try {
      const resSign = await fetch('/api/cloudinary-sign', { method: 'POST' });
      const { signature, timestamp } = await resSign.json();

      const file = e.target.files[0];
      if (!file) return toast.error('No file selected', { id: toastId });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.secure_url) throw new Error('Upload failed, no URL returned');

      setValue('image', data.secure_url, { shouldValidate: true });
      toast.success('File uploaded successfully', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Upload failed', { id: toastId });
    }
  };

  if (error) return error.message;
  if (!product) return 'Loading...';

  const sizesOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div>
      <h1 className='py-4 text-2xl'>Edit Product {formatId(productId)}</h1>
      <form onSubmit={handleSubmit(formSubmit)}>
        <FormInput name='Name' id='name' required />
        <FormInput name='Slug' id='slug' required />
        <FormInput name='Image' id='image' required={false} />

        <div className='mb-6 md:flex'>
          <label className='label md:w-1/5' htmlFor='imageFile'>Upload Image</label>
          <div className='md:w-4/5'>
            <input type='file' className='file-input w-full max-w-md' id='imageFile' onChange={uploadHandler} />
          </div>
        </div>

        <FormInput name='Price' id='price' required />

        {/* Category dropdown */}
        <div className='mb-6 md:flex'>
          <label className='label md:w-1/5' htmlFor='category'>Category</label>
          <div className='md:w-4/5'>
            <select
              id='category'
              className='select select-bordered w-full max-w-md'
              {...register('category', { required: 'Category is required' })}
              onChange={(e) => setShowCustomCategory(e.target.value === 'Others')}
            >
              {[
                'SHIRTS', 'T-SHIRTS', 'TROUSERS', 'JEANS',
                'JACKETS', 'SWEATERS', 'HOODIES', 'SHORTS', 'Lehenga','Others'
              ].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {showCustomCategory && (
              <input
                type='text'
                
                className='input input-bordered w-full max-w-md mt-2'
                {...register('category', { required: 'Category is required' })}
              />
            )}
          </div>
        </div>

        <FormInput name='Brand' id='brand' required />
        <FormInput name='Description' id='description' required />
        <FormInput name='Count In Stock' id='countInStock' required />

        {/* Sizes Multi Checkbox */}
        <div className='mb-6 md:flex'>
          <label className='label md:w-1/5'>Available Sizes</label>
          <div className='md:w-4/5 flex flex-wrap gap-2'>
            {sizesOptions.map((size) => (
              <label key={size} className='flex items-center gap-1'>
                <input
                  type='checkbox'
                  value={size}
                  checked={watchedSizes.includes(size)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const currentSizes = watchedSizes || [];
                    if (checked) setValue('sizes', [...currentSizes, size]);
                    else setValue('sizes', currentSizes.filter((s) => s !== size));
                  }}
                  className='checkbox'
                />
                {size}
              </label>
            ))}
          </div>
          {errors.sizes && <p className='text-error mt-1'>Please select at least one size</p>}
        </div>

        <button type='submit' disabled={isUpdating || !getValues('image')} className='btn btn-primary'>
          {isUpdating && <span className='loading loading-spinner'></span>}
          Update
        </button>
        <Link className='btn ml-4' href='/admin/products'>Cancel</Link>
      </form>
    </div>
  );
}

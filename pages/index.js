'use client';

import React, { useState, useRef, useReducer } from 'react';

export default function Page() {
  const initialState = {
    pledge: '',
    deadline: '',
    penalty: '',
    charity: '',
    paymentAddress: '',
    proof: '',
    selectedFile: null,
  };

  function reducer(state, action) {
    const { type, value } = action;
    if (typeof value === 'object') return { ...state, ...value };
    return { ...state, [type]: value };
  }

  const [loading, setLoading] = useState(false);
  const [formState, editForm] = useReducer(reducer, initialState);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    editForm({ type: 'selectedFile', value: file });
  };

  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let fileUrl = '';
      if (formState.selectedFile) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(formState.selectedFile.name);
        await fileRef.put(formState.selectedFile);
        fileUrl = await fileRef.getDownloadURL();
      }
      delete formState['selectedFile'];

      editForm(initialState);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('There was a problem submitting your form. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="card border border-purple-500 shadow-lg p-8 m-8 rounded-lg">
        <h2 className="text-center text-4xl font-bold pb-4 text-purple-500">
          Make a Pledge
        </h2>
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="form-control">
            <label className="label text-purple-500">
              <span className="label-text">What's your awesome pledge?</span>
            </label>
            <input
              type="text"
              placeholder="Type your pledge here"
              className="input input-bordered w-full shadow-md hover:bg-pink-100 focus:ring-purple-500 bg-white"
              value={formState.pledge}
              onChange={(e) =>
                editForm({ type: 'pledge', value: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label text-purple-500">
              <span className="label-text">Penalty Amount (USD)</span>
            </label>
            <select
              className="select select-bordered shadow-md bg-white focus:ring-purple-500 hover:bg-red-100"
              value={formState.penalty}
              onChange={(e) =>
                editForm({ type: 'penalty', value: e.target.value })
              }
              defaultValue={'Pick one'}
            >
              <option disabled>Pick one</option>
              <option>$5</option>
              <option>$10</option>
              <option>$15</option>
              <option>$20</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label text-purple-500">
              <span className="label-text">Charity Organization</span>
            </label>

            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full shadow-md hover:bg-pink-100 focus:ring-purple-500 bg-white"
              value={formState.charity}
              onChange={(e) =>
                editForm({ type: 'charity', value: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label text-purple-500">
              <span className="label-text">
                Payment Address (Venmo, CashApp, etc.):
              </span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full shadow-md focus:ring-pink-500 hover:bg-pink-100 focus:ring-purple-400 bg-white"
              value={formState.paymentAddress}
              onChange={(e) =>
                editForm({ type: 'paymentAddress', value: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label text-purple-500" htmlFor="fileUpload">
              <span className="label-text">
                Proof of Starting Point (Photo, Video):
              </span>
            </label>
            <div className="flex items-center">
              <label
                className="btn btn-primary py-2 px-4 bg-purple-500 text-white hover:bg-gradient-to-r from-purple-500 to-pink-500"
                htmlFor="fileUpload"
              >
                Choose File
              </label>
              <button
                type="submit"
                className="btn btn-primary py-2 shadow-md ml-4 bg-indigo-500 text-white hover:bg-gradient-to-r from-indigo-500 to-teal-500"
                onClick={() => router.push('/work-mode')}
              >
                Submit
              </button>
            </div>
            <input
              id="fileUpload"
              type="file"
              className="file-input hidden"
              onChange={handleFileSelect}
            />
            {formState.selectedFile && (
              <p className="mt-2 text-gray-500">
                {formState.selectedFile.name}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

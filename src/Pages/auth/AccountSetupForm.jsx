import React, { useState, useEffect } from 'react';
import './AccountSetupForm.css';
import {
    useSignupMutation,
  } from "../../slices/customerSlice";
import toast from "react-hot-toast";
const AccountSetupForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [activity, setActivity] = useState('');
const [register, { isLoading, error, data, isError }] = useSignupMutation();

  const [errors, setErrors] = useState({
    companyName: '',
    activity: '',
  });

  const handleActivityChange = (event) => {
    setActivity(event.target.value);
  };

  useEffect(() => {
    const userDetails = sessionStorage.getItem("userDetails");
    if (userDetails) {
      console.log("Session Storage User Details in accountsetupForm:", JSON.parse(userDetails));
    }
  }, []);
  

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Reset errors
//     setErrors({
//       companyName: '',
//       activity: '',
//     });

//     let isValid = true;

//     // Validate Company Name
//     if (!companyName) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         companyName: 'Company Name is required.',
//       }));
//       isValid = false;
//     }

//     // Validate Main Activity
//     if (!activity) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         activity: 'Main Activity is required.',
//       }));
//       isValid = false;
//     }

//     // If validation passes, proceed with storing data in sessionStorage
//     if (isValid) {
//       const userDetails = JSON.parse(sessionStorage.getItem('userDetails')) || {};
//       userDetails.companyName = companyName;
//       userDetails.mainActivity = activity;
//       sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
//       console.log("Updated Session Storage User Details:", JSON.parse(sessionStorage.getItem("userDetails")));
//         // window.location.href =
//         //     import.meta.env.VITE_JARVIS_MARKETING + "/registration-successful";
//         // toast.success("Registration Complete, Please verify your email to login");
//     }
//   };

const handleSubmit = (event) => {
    event.preventDefault();

    // Reset errors
    setErrors({
      companyName: '',
      activity: '',
    });

    let isValid = true;

    // Validate Company Name
    if (!companyName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        companyName: 'Company Name is required.',
      }));
      isValid = false;
    }

    // Validate Main Activity
    if (!activity) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        activity: 'Main Activity is required.',
      }));
      isValid = false;
    }

    // If validation passes, proceed with storing data in sessionStorage
    if (isValid) {
      // Get the existing user details from sessionStorage (this contains data except companyName and mainActivity)
      const userDetails = JSON.parse(sessionStorage.getItem('userDetails')) || {};

      // Update userDetails with companyName and mainActivity
      userDetails.companyName = companyName;
      userDetails.mainActivity = activity;

      // Save the updated userDetails back to sessionStorage
      sessionStorage.setItem('userDetails', JSON.stringify(userDetails));

      console.log("Updated Session Storage User Details:", JSON.parse(sessionStorage.getItem("userDetails")));

      // Send the updated details to the backend for final registration
      register({ body: userDetails }) // Use the correct API call function here
        .unwrap() // If using RTK Query to unwrap the promise
        .then((response) => {
          console.log('Done')
            window.location.href =
                import.meta.env.VITE_JARVIS_MARKETING + "/registration-successful";
            toast.success("Registration Complete, Please verify your email to login");
        })
        .catch((error) => {
          // Handle errors during registration
          toast.error(error.data.message);
        });
    }
};
  
  
  return (
    <div className="wrapper">
      <section id="topNav">
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand" href="index.html">
              <img
                src="https://d2ds8yldqp7gxv.cloudfront.net/lead/jarvis-logo.png"
                alt="logo"
                width="200"
                height="33"
              />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>
      </section>

      <section id="signupSection">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="grow-faster-one">
                <h2>Close More Deals Grow Faster</h2>
                <p>
                  Jarvis Reach can enhance any LinkedIn profile with emails and phone numbers – even if you
                  haven’t connected with them.
                </p>
                <ul>
                  <li>
                    <i className="fa-solid fa-circle-check"></i> Get 100 free credits every month
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check"></i> Real-time email and phone verification
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check"></i> Native integrations to popular CRMs
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="signup-center-one">
                <h1>Let's set up your account</h1>
                <form className="row g-3" id="signupForm" onSubmit={handleSubmit}>
                  <div className="col-md-12">
                    <input
                      type="text"
                      className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                      id="companyName"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    {errors.companyName && (
                      <div className="invalid-feedbacks">{errors.companyName}</div>
                    )}
                  </div>

                  <div className="checking-radia">
                    <h4>What will be your main activity with Jarvis Reach</h4>
                    <ul>
                      <li>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
                            type="radio"
                            name="activity"
                            value="Sales"
                            checked={activity === 'Sales'}
                            onChange={handleActivityChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefaultSales">
                            Sales
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
                            type="radio"
                            name="activity"
                            value="Marketing"
                            checked={activity === 'Marketing'}
                            onChange={handleActivityChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefaultMarketing">
                            Marketing
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
                            type="radio"
                            name="activity"
                            value="Recruiting"
                            checked={activity === 'Recruiting'}
                            onChange={handleActivityChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefaultRecruiting">
                            Recruiting
                          </label>
                        </div>
                      </li>
                    </ul>
                    <ul className='mt-3'>
                      <li>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
                            type="radio"
                            name="activity"
                            value="Job Seeking"
                            checked={activity === 'Job Seeking'}
                            onChange={handleActivityChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefaultJobSeeking">
                            Job Seeking
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
                            type="radio"
                            name="activity"
                            value="Founder"
                            checked={activity === 'Founder'}
                            onChange={handleActivityChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefaultFounder">
                            Founder
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
                            type="radio"
                            name="activity"
                            value="Others"
                            checked={activity === 'Others'}
                            onChange={handleActivityChange}
                          />
                          <label className="form-check-label" htmlFor="flexRadioDefaultOthers">
                            Others
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                    {errors.activity && (
                      <div className="invalid-feedbacks">{errors.activity}</div>
                    )}

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-submit" >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountSetupForm;



// import React, { useState } from 'react';
// import './AccountSetupForm.css';

// const AccountSetupForm = () => {
//   const [companyName, setCompanyName] = useState('');
//   const [activity, setActivity] = useState('');
//   const [errors, setErrors] = useState({
//     companyName: '',
//     activity: '',
//   });

//   const handleActivityChange = (event) => {
//     setActivity(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Reset errors
//     setErrors({
//       companyName: '',
//       activity: '',
//     });

//     let isValid = true;

//     // Validate Company Name
//     if (!companyName) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         companyName: 'Company Name is required.',
//       }));
//       isValid = false;
//     }

//     // Validate Main Activity
//     if (!activity) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         activity: 'Main Activity is required.',
//       }));
//       isValid = false;
//     }

//     // If validation passes, proceed with storing data in sessionStorage
//     if (isValid) {
//       const userDetails = JSON.parse(sessionStorage.getItem('userDetails')) || {};
//       userDetails.companyName = companyName;
//       userDetails.mainActivity = activity;
//       sessionStorage.setItem('userDetails', JSON.stringify(userDetails));

//       console.log("Updated Session Storage User Details:", JSON.parse(sessionStorage.getItem("userDetails")));
//     }
//   };

//   return (
//     <div className="wrapper">
//       <section id="topNav">
//         <nav className="navbar navbar-expand-lg fixed-top">
//           <div className="container-fluid">
//             <a className="navbar-brand" href="index.html">
//               <img
//                 src="https://d2ds8yldqp7gxv.cloudfront.net/lead/jarvis-logo.png"
//                 alt="logo"
//                 width="200"
//                 height="33"
//               />
//             </a>
//             <button
//               className="navbar-toggler"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#navbarSupportedContent"
//               aria-controls="navbarSupportedContent"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon"></span>
//             </button>
//           </div>
//         </nav>
//       </section>

//       <section id="signupSection">
//         <div className="container">
//           <div className="row">
//             <div className="col-md-6">
//               <div className="grow-faster-one">
//                 <h2>Close More Deals Grow Faster</h2>
//                 <p>
//                   Jarvis Reach can enhance any LinkedIn profile with emails and phone numbers – even if you
//                   haven’t connected with them.
//                 </p>
//                 <ul>
//                   <li>
//                     <i className="fa-solid fa-circle-check"></i> Get 100 free credits every month
//                   </li>
//                   <li>
//                     <i className="fa-solid fa-circle-check"></i> Real-time email and phone verification
//                   </li>
//                   <li>
//                     <i className="fa-solid fa-circle-check"></i> Native integrations to popular CRMs
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="signup-center-one">
//                 <h1>Let's set up your account</h1>
//                 <form className="row g-3" id="signupForm" onSubmit={handleSubmit}>
//                   <div className="col-md-12">
//                     <input
//                       type="text"
//                       className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
//                       id="companyName"
//                       placeholder="Company Name"
//                       value={companyName}
//                       onChange={(e) => setCompanyName(e.target.value)}
//                     />
//                     {errors.companyName && (
//                       <div className="invalid-feedback">{errors.companyName}</div>
//                     )}
//                   </div>

//                   <div className="checking-radia">
//                     <h4>What will be your main activity with Jarvis Reach</h4>
//                     <ul>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
//                             type="radio"
//                             name="activity"
//                             value="Sales"
//                             checked={activity === 'Sales'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultSales">
//                             Sales
//                           </label>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
//                             type="radio"
//                             name="activity"
//                             value="Marketing"
//                             checked={activity === 'Marketing'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultMarketing">
//                             Marketing
//                           </label>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
//                             type="radio"
//                             name="activity"
//                             value="Recruiting"
//                             checked={activity === 'Recruiting'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultRecruiting">
//                             Recruiting
//                           </label>
//                         </div>
//                       </li>
//                     </ul>
//                     <ul className='mt-3'>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
//                             type="radio"
//                             name="activity"
//                             value="Job Seeking"
//                             checked={activity === 'Job Seeking'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultJobSeeking">
//                             Job Seeking
//                           </label>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
//                             type="radio"
//                             name="activity"
//                             value="Founder"
//                             checked={activity === 'Founder'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultFounder">
//                             Founder
//                           </label>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className={`form-check-input ${errors.activity ? 'is-invalid' : ''}`}
//                             type="radio"
//                             name="activity"
//                             value="Others"
//                             checked={activity === 'Others'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultOthers">
//                             Others
//                           </label>
//                         </div>
//                       </li>
//                     </ul>
//                     {errors.activity && (
//                       <div className="invalid-feedback">{errors.activity}</div>
//                     )}
//                   </div>

//                   <div className="d-grid gap-2">
//                     <button type="submit" className="btn btn-submit">
//                       Continue
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AccountSetupForm;



// import React, { useState } from 'react';
// import './AccountSetupForm.css'; 

// const AccountSetupForm = () => {
//   const [companyName, setCompanyName] = useState('');
//   const [activity, setActivity] = useState('');

//   const handleActivityChange = (event) => {
//     setActivity(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const userDetails = JSON.parse(sessionStorage.getItem('userDetails')) || {};
//     userDetails.companyName = companyName;
//     userDetails.mainActivity = activity;
//     sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
//     console.log("Updated Session Storage User Details:", JSON.parse(sessionStorage.getItem("userDetails")));
//   };

//   return (
//     <div className="wrapper">
//       <section id="topNav">
//         <nav className="navbar navbar-expand-lg fixed-top">
//           <div className="container-fluid">
//             <a className="navbar-brand" href="index.html">
//               <img
//                 src="https://d2ds8yldqp7gxv.cloudfront.net/lead/jarvis-logo.png"
//                 alt="logo"
//                 width="200"
//                 height="33"
//               />
//             </a>
//             <button
//               className="navbar-toggler"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#navbarSupportedContent"
//               aria-controls="navbarSupportedContent"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon"></span>
//             </button>
//           </div>
//         </nav>
//       </section>

//       <section id="signupSection">
//         <div className="container">
//           <div className="row">
//             <div className="col-md-6">
//               <div className="grow-faster-one">
//                 <h2>Close More Deals Grow Faster</h2>
//                 <p>
//                   Jarvis Reach can enhance any LinkedIn profile with emails and phone numbers – even if you
//                   haven’t connected with them.
//                 </p>
//                 <ul>
//                   <li>
//                     <i className="fa-solid fa-circle-check"></i> Get 100 free credits every month
//                   </li>
//                   <li>
//                     <i className="fa-solid fa-circle-check"></i> Real time email and phone verification
//                   </li>
//                   <li>
//                     <i className="fa-solid fa-circle-check"></i> Native integrations to popular CRMs
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="signup-center-one">
//                 <h1>Let's set up your account</h1>
//                 <form className="row g-3" id="signupForm" onSubmit={handleSubmit}>
//                   <div className="col-md-12">
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="companyName"
//                       placeholder="Company Name"
//                       value={companyName}
//                       onChange={(e) => setCompanyName(e.target.value)}
//                     />
//                   </div>

//                   <div className="checking-radia">
//                     <h4>What will be your main activity with Jarvis Reach</h4>
//                     <ul>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="activity"
//                             value="Sales"
//                             checked={activity === 'Sales'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultSales">
//                             Sales
//                           </label>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="activity"
//                             value="Marketing"
//                             checked={activity === 'Marketing'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultMarketing">
//                             Marketing
//                           </label>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="activity"
//                             value="Recruiting"
//                             checked={activity === 'Recruiting'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultRecruiting">
//                             Recruiting
//                           </label>
//                         </div>
//                       </li>
//                     </ul>
//                      <ul className='mt-3'> 
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="activity"
//                             value="Job Seeking"
//                             checked={activity === 'Job Seeking'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultJobSeeking">
//                             Job Seeking
//                           </label>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="activity"
//                             value="Founder"
//                             checked={activity === 'Founder'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultFounder">
//                             Founder
//                           </label>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="activity"
//                             value="Others"
//                             checked={activity === 'Others'}
//                             onChange={handleActivityChange}
//                           />
//                           <label className="form-check-label" htmlFor="flexRadioDefaultOthers">
//                             Others
//                           </label>
//                         </div>
//                       </li>
//                     </ul>
//                   </div>

//                   <div className="d-grid gap-2">
//                     <button type="submit" className="btn btn-submit">
//                       Continue
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AccountSetupForm;

import * as Yup from 'yup'; 

const analyticsDatePickSchema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required').max(Yup.ref('endDate'),"Start date can't be later than end date"),
    endDate: Yup.date().required('End date is required').min(Yup.ref('startDate'),"End date can't be earlier than start date"),
  });

  export default analyticsDatePickSchema;
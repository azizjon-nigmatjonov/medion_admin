import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CancelButton from "../../components/Buttons/CancelButton";
import SaveButton from "../../components/Buttons/SaveButton";
import CBreadcrumbs from "../../components/CBreadcrumbs";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import Header from "../../components/Header";
import userService from "../../services/auth/userService";
import listToOptions from "../../utils/listToOptions";
import "./style.scss";
import { add } from "date-fns";
import { useForm } from "react-hook-form";
import HFTextField from "../../components/FormElements/HFTextField";
import HFDatePicker from "../../components/FormElements/HFDatePicker";
import HFSelect from "../../components/FormElements/HFSelect";
import clientTypeService from "../../services/auth/clientTypeService";
import HFAvatarUpload from "../../components/FormElements/HFAvatarUpload";

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   email: Yup.string().required('Email is required').email('Email is incorrect'),
//   login: Yup.string().required('Login is required'),
//   phone: Yup.string().required('Phone is required'),
//   expires_at: Yup.mixed().required('Expires date is required'),
//   client_type_id: Yup.mixed().required('Type is required'),
//   role_id: Yup.mixed().required('Role is required')
// })

// const passwordValidation = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   email: Yup.string().required('Email is required').email('Email is incorrect'),
//   login: Yup.string().required('Login is required'),
//   phone: Yup.string().required('Phone is required'),
//   expires_at: Yup.mixed().required('Expires date is required'),
//   client_type_id: Yup.mixed().required('Type is required'),
//   role_id: Yup.mixed().required('Role is required'),
//   password: Yup.string().required('Password is required').min(6, "The password length must be at least 6")
// })

const UsersForm = () => {
  const { userId, platformId, typeId } = useParams();
  const navigate = useNavigate();

  const [btnLoader, setBtnLoader] = useState(false);
  const [loader, setLoader] = useState(true);
  const [rolesList, setRolesList] = useState([]);
  const [userTypesList, setUserTypesList] = useState([]);

  const breadCrumbItems = [
    {
      label: "Users",
      link: -1,
    },
    {
      label: "Create",
    },
  ];

  const fetchUserTypesList = () => {
    clientTypeService
      .getList()
      .then((res) => setUserTypesList(listToOptions(res.client_types, "name")));
  };

  const fetchRolesList = (typeID) => {
    setRolesList([]);
    clientTypeService
      .getById(typeID)
      .then((res) => setRolesList(listToOptions(res.roles, "name")));
  };

  const fetchData = () => {
    if (!userId) return setLoader(false);

    userService
      .getById(userId)
      .then((res) => {
        reset({
          ...getValues,
          ...res,
        });
      })
      .finally(() => setLoader(false));
  };

  const onSubmit = (values) => {
    if (userId) return update(values);
    create(values);
  };

  const create = (data) => {
    setBtnLoader(true);
    userService
      .create(data)
      .then((res) => {
        navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const update = (data) => {
    setBtnLoader(true);
    userService
      .update(data)
      .then((res) => {
        navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const { control, watch, handleSubmit, setValue, reset, getValues } = useForm({
    defaultValues: {
      client_platform_id: platformId ?? import.meta.env.VITE_AUTH_PLATFORM_ID,
      project_id: import.meta.env.VITE_AUTH_PROJECT_ID,
      client_type_id: typeId ?? "",
      active: 1,
      name: "",
      email: "",
      login: "",
      password: "",
      phone: "",
      expires_at: add(new Date(), { years: 1 }),
      photo_url: "",
      role_id: "",
    },
  });

  useEffect(() => {
    fetchData();
    fetchUserTypesList();
  }, []);

  useEffect(() => {
    if (loader) return;
    if (userId) fetchRolesList(getValues("client_type_id"));
  }, [loader]);

  // useEffect(() => {
  //   const subscription = watch((values, { name, type }) => {
  //     if (name === "client_type_id" && values.client_type_id) {
  //       fetchRolesList(values.client_type_id);
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Header
        title="Пользователи"
        backButtonLink={-1}
        subtitle={userId ? watch("name") : "Новый"}
        loader={loader}
        extra={
          <>
            <CancelButton onClick={() => navigate(-1)} />
            <SaveButton type="submit" loading={btnLoader} />
          </>
        }
      >
        {/* <CBreadcrumbs withDefautlIcon items={breadCrumbItems} type="link" /> */}
      </Header>

      <FormCard visible={!loader} title="Main info" className="UsersForm p-2">
        <div>
          <HFAvatarUpload control={control} name="photo_url" />
        </div>

        <div className="side">
          <FRow label="Fullname">
            <HFTextField
              placeholder="Enter fullname"
              fullWidth
              control={control}
              autoFocus
              name="name"
            />
          </FRow>

          <FRow label="Email">
            <HFTextField
              placeholder="Enter email"
              fullWidth
              control={control}
              name="email"
            />
          </FRow>

          <FRow label="Phone">
            <HFTextField
              placeholder="Enter phone"
              fullWidth
              control={control}
              name="phone"
            />
          </FRow>

          <FRow label="Login">
            <HFTextField
              placeholder="Enter login"
              fullWidth
              control={control}
              name="login"
            />
          </FRow>

          {!userId && (
            <FRow label="Password">
              <HFTextField
                type="password"
                fullWidth
                control={control}
                name="password"
                placeholder="Enter password"
              />
            </FRow>
          )}

          <FRow label="Expires date">
            <HFDatePicker width="100%" control={control} name="expires_at" />
          </FRow>

          <FRow label="Type">
            <HFSelect
              options={userTypesList}
              fullWidth
              control={control}
              onChange={() => setValue("role_id", "")}
              name="client_type_id"
            />
          </FRow>

          <FRow label="Role">
            <HFSelect
              options={rolesList}
              fullWidth
              control={control}
              name="role_id"
            />
          </FRow>
        </div>
      </FormCard>
    </form>
  );
};

export default UsersForm;

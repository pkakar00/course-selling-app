import { useRecoilValue } from "recoil";
import { loggedIn } from "../states/loginAtom";
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Checkbox,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Punjabi",
  "Hindi",
];

export default function AdminNewCourse({ edit }: { edit: boolean }) {
  const navigate = useNavigate();
  const login = useRecoilValue(loggedIn);
  const [courseName, setCourseName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [courseSmallDes, setCourseSmallDes] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [price, setPrice] = useState(0);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [description, setDescription] = useState<string>();
  const [requirements, setRequirements] = useState<string[]>([]);
  const [audioLang, setAudioLang] = useState<string[]>([]);
  const [subTitleLang, setSubTitleLang] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [videoName, setVideoName] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<number>(0);
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  function getSeverity(){
    return severity === 200 ? "success" : "error";
  }
  useEffect(() => {
    (async () => {
      const request = await fetch(`${baseUrl}/course/${id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (request.status === 200) {
        const course: Course = await request.json();
        const videoNames: string[] = [];
        const videoLinks: string[] = [];
        for (const i of course.videos) {
          videoNames.push(i.videoName);
          videoLinks.push(i.videoLink);
        }
        setSeverity(200);
        setCourseName(course.courseName);
        setTeacherName(course.teacherName);
        setCourseSmallDes(course.courseSmallDescription);
        setPrice(course.price);
        setImageLink(course.courseImageLink);
        setObjectives(course.objectives);
        setDescription(course.description);
        setRequirements(course.requirements);
        setAudioLang(course.audioLanguages);
        setSubTitleLang(course.subtitleLanguages);
        setTags(course.tags);
        setVideoName(videoNames);
        setVideoLink(videoLinks);
      }
    })();
  }, []);

  const submitForm = async () => {
    if (videoLink.length !== videoName.length) {
      setMessage("Number of links is not equal to number of names");
      return;
    }
    const videos: Video[] = [];
    for (let i = 0; i < videoLink.length; i++) {
      videos.push({ videoName: videoName[i], videoLink: videoLink[i] });
    }
    console.log(teacherName);
    if (!edit) {
      const response = await fetch(`${baseUrl}/admin/new-course`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          courseName,
          teacherName,
          courseSmallDescription: courseSmallDes,
          numberOfStudents: 0,
          audioLanguages: audioLang,
          subtitleLanguages: subTitleLang,
          objectives,
          requirements: requirements,
          description,
          rating: 0,
          courseImageLink: imageLink,
          videos,
          tags,
          price,
        }),
      });
      if (response.status === 200) {
        setMessage("Course Created Succcessfully!");
      } else if (response.status === 411) {
        const message = await response.json();
        setMessage(message.message);
      } else setMessage("Server down");
    } else {
      const editResponse = await fetch(
        `${baseUrl}/admin/edit-course/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            courseName,
            teacherName,
            courseSmallDescription: courseSmallDes,
            numberOfStudents: 0,
            audioLanguages: audioLang,
            subtitleLanguages: subTitleLang,
            objectives,
            requirements: requirements,
            description,
            rating: 0,
            courseImageLink: imageLink,
            videos,
            tags,
            price,
          }),
        }
      );
      if (editResponse.status === 200) {
        setMessage("Course Updated Succcessfully!");
      } else if (editResponse.status === 411) {
        const message = await editResponse.json();
        setMessage(message.message);
      } else setMessage("Server down");
    }
  };
  if (!login) {
    return (
      <>
        <p>
          Not Logged in,{" "}
          <Button
            onClick={() => {
              navigate("/admin/login");
            }}
          >
            Login
          </Button>
        </p>
      </>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "5vh",
      }}
    >
      <Typography sx={{ fontFamily: "Poppins", fontSize: "4vh" }}>
        Create a new course with this form.
      </Typography>
      {message.length > 0 && <Alert severity={getSeverity()}>{message}</Alert>}
      <Card
        sx={{
          marginTop: "3vh",
          display: "flex",
          flexDirection: "column",
          gap: "2vh",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
          width: "35vw",
          padding: "2vh",
        }}
        variant="outlined"
      >
        <TextField
          sx={{ width: "35vw" }}
          variant="outlined"
          label="Course name"
          value={courseName}
          onChange={(e) => {
            setCourseName(e.target.value);
          }}
        />
        <TextField
          sx={{ width: "35vw" }}
          variant="outlined"
          label="Teacher name"
          value={teacherName}
          onChange={(e) => {
            setTeacherName(e.target.value);
          }}
        />
        <TextField
          sx={{ width: "35vw" }}
          variant="outlined"
          label="Course small description"
          value={courseSmallDes}
          onChange={(e) => {
            setCourseSmallDes(e.target.value);
          }}
        />
        <TextField
          sx={{ width: "35vw" }}
          variant="outlined"
          label="Price"
          value={price}
          type="number"
          onChange={(e) => {
            setPrice(Number(e.target.value));
          }}
        />
        <TextField
          sx={{ width: "35vw" }}
          variant="outlined"
          label="Image Link"
          value={imageLink}
          onChange={(e) => {
            setImageLink(e.target.value);
          }}
        />
        <LanguageTags
          sx={{ width: "35vw" }}
          placeholder={"Audio Languages"}
          setArray={setAudioLang}
          array={audioLang}
        />
        <LanguageTags
          sx={{ width: "35vw" }}
          placeholder={"Subtitle Languages"}
          setArray={setSubTitleLang}
          array={subTitleLang}
        />
        <TextField
          sx={{ width: "35vw" }}
          multiline
          placeholder="Course Description"
          maxRows={50}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <FreeSoloCreateOption
          sx={{ width: "35vw" }}
          placeholder="Course Objectives"
          value={objectives}
          setValue={setObjectives}
        />
        <FreeSoloCreateOption
          sx={{ width: "35vw" }}
          value={requirements}
          setValue={setRequirements}
          placeholder="Requirements"
        />
        <FreeSoloCreateOption
          sx={{ width: "35vw" }}
          value={tags}
          setValue={setTags}
          placeholder="Course tags"
        />
        <FreeSoloCreateOption
          sx={{ width: "35vw" }}
          value={videoName}
          setValue={setVideoName}
          placeholder="Video Names"
        />
        <FreeSoloCreateOption
          sx={{ width: "35vw" }}
          value={videoLink}
          setValue={setVideoLink}
          placeholder="Video Links"
        />
        <Button
          onClick={() => {
            submitForm();
          }}
          color="success"
          variant="contained"
        >
          Create
        </Button>
      </Card>
    </div>
  );
}
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
function LanguageTags({ sx, setArray, placeholder, array }) {
  return (
    <Autocomplete
      sx={sx}
      multiple
      options={languages}
      value={array}
      disableCloseOnSelect
      onChange={(a, b) => {
        setArray(b);
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={placeholder} placeholder={placeholder} />
      )}
    />
  );
}
const filter = createFilterOptions<string>();
function FreeSoloCreateOption({ value, setValue, sx, placeholder }) {
  return (
    <Autocomplete
      sx={sx}
      multiple
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option);
        if (inputValue !== "" && !isExisting) {
          filtered.push(inputValue);
        }
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={value}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        return option;
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      freeSolo
      renderInput={(params) => <TextField {...params} label={placeholder} />}
    />
  );
}

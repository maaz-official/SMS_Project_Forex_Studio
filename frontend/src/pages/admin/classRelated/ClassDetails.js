import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';

const ClassDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id;

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
        dispatch(getClassStudents(classID));
    }, [dispatch, classID]);

    if (error) {
        console.log(error);
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("معذرت، فی الحال حذف کرنے کی صلاحیت بند کر دی گئی ہے۔");
        setShowPopup(true);
    };

    const subjectColumns = [
        { id: 'name', label: 'مضمون کا نام', minWidth: 170 },
        { id: 'code', label: 'مضمون کا کوڈ', minWidth: 100 },
    ];

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    });

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`);
                    }}
                >
                    دیکھیں
                </BlueButton>
            </>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'نیا مضمون شامل کریں',
            action: () => navigate("/Admin/addsubject/" + classID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'تمام مضامین حذف کریں',
            action: () => deleteHandler(classID, "SubjectsClass")
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <>
                {response ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            مضامین شامل کریں
                        </GreenButton>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            مضامین کی فہرست:
                        </Typography>

                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                )}
            </>
        );
    };

    const studentColumns = [
        { id: 'name', label: 'نام', minWidth: 170 },
        { id: 'rollNum', label: 'رول نمبر', minWidth: 100 },
    ];

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    });

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    دیکھیں
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    حاضری
                </PurpleButton>
            </>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'نیا طالب علم شامل کریں',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'تمام طلباء حذف کریں',
            action: () => deleteHandler(classID, "StudentsClass")
        }
    ];

    const ClassStudentsSection = () => {
        return (
            <>
                {getresponse ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                        >
                            طلباء شامل کریں
                        </GreenButton>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            طلباء کی فہرست:
                        </Typography>

                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </>
        );
    };

    const ClassTeachersSection = () => {
        return (
            <>
                اساتذہ
            </>
        );
    };

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList.length;
        const numberOfStudents = sclassStudents.length;

        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    کلاس کی تفصیلات
                </Typography>
                <Typography variant="h5" gutterBottom>
                    یہ کلاس {sclassDetails && sclassDetails.sclassName} ہے
                </Typography>
                <Typography variant="h6" gutterBottom>
                    مضامین کی تعداد: {numberOfSubjects}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    طلباء کی تعداد: {numberOfStudents}
                </Typography>
                {getresponse &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                    >
                        طلباء شامل کریں
                    </GreenButton>
                }
                {response &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/addsubject/" + classID)}
                    >
                        مضامین شامل کریں
                    </GreenButton>
                }
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div>لوڈ ہو رہا ہے...</div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="تفصیلات" value="1" />
                                    <Tab label="مضامین" value="2" />
                                    <Tab label="طلباء" value="3" />
                                    <Tab label="اساتذہ" value="4" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <ClassDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <ClassSubjectsSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <ClassStudentsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <ClassTeachersSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ClassDetails;

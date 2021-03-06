import { useState, useEffect } from "react"
import axios from "axios";
import { Select, Button, message, InputNumber, Modal } from "antd";
import { giftIcon } from "../components/data";
import '../style/css/collection.css';
import { Link } from "react-router-dom";
import classNames from "classnames";
export default function Collection(props: any) {
    const [planNameList, setPlanNameList] = useState<string[]>([]);
    const [currentPlanName, setCurrentPlanName] = useState<string | null>(null);
    const [currentPlan, setCurrentPlan] = useState<any>(null);
    const [usingPlan, setUsingPlan] = useState<any>(null);
    const [initalAmount, setInitalAmout] = useState<any>(0);
    const [perAmount, setPerAmount] = useState<any>(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    useEffect(() => {
        axios({
            method: "get",
            url: 'https://qco156.fn.thelarkcloud.com/returnAllPlanName'
        }).then((res) => {
            setPlanNameList(res.data);
            setCurrentPlanName(res.data[0])
        })

        axios({
            method: 'get',
            url: "https://qco156.fn.thelarkcloud.com/returnUsingPlan"
        }).then((res) => setUsingPlan(res.data.planName))

        axios({
            method: "get",
            url: "https://qco156.fn.thelarkcloud.com/returnAmount"
        }).then((res) => {
            setInitalAmout(res.data.initalAmount);
            setPerAmount(res.data.perAmount)
        })
    }, []);

    useEffect(() => {
        if (currentPlanName !== null)
            axios({
                method: 'post',
                url: "https://qco156.fn.thelarkcloud.com/returnPlanData",
                data: {
                    planName: currentPlanName
                }
            }).then((res) => {
                setCurrentPlan(res.data)
            })
    }, [currentPlanName]);
    const { Option } = Select;

    const setPlan = () => {
        axios({
            method: 'post',
            url: 'https://qco156.fn.thelarkcloud.com/setPlan',
            data: {
                newPlanName: currentPlanName
            }
        })
            .then((res) => {
                console.log(res.data)
                if (res.data === 'success') message.success('?????????????????????????????????')
                else message.error('????????????????????????')
            })
            .then(() =>
                axios({
                    method: 'get',
                    url: "https://qco156.fn.thelarkcloud.com/returnUsingPlanName"
                })
            )
            .then((res) => setUsingPlan(res.data))
    }

    const saveAmountChange = () => {
        let result1 = String(initalAmount).indexOf('.');
        let result2 = String(perAmount).indexOf('.');
        if (result1 == -1 && result2 == -1) {
            axios({
                method: "post",
                url: "https://qco156.fn.thelarkcloud.com/setInitalAmount",
                data: {
                    initalAmount: initalAmount,
                    perAmount: perAmount
                }
            }).then((res) => {
                if (res.data == 'success') message.success('????????????')
            })
        }
        else {
            message.warn('????????????????????????')
        }
    }

    const handleDelete = () => {
        axios({
            method: "post",
            url: "https://qco156.fn.thelarkcloud.com/delPlan",
            data: {
                planName: currentPlanName
            }
        }).then((res) => {
            if (res.data == 'success') {
                message.success('????????????');
                setModalVisible(false)
            }
            else {
                message.error('????????????');
                setModalVisible(false)
            }
        }).then(() => {
            axios({
                method: "get",
                url: 'https://qco156.fn.thelarkcloud.com/returnAllPlanName'
            }).then((res) => {
                setPlanNameList(res.data);
                setCurrentPlanName(res.data[0])
            })
            axios({
                method: 'get',
                url: "https://qco156.fn.thelarkcloud.com/returnUsingPlan"
            }).then((res) => setUsingPlan(res.data.planName))
        })
    }
    return (
        <div className='collectionPage'>

            <div className='topPart'>
                <div className='inputItem'>
                    <span>???????????????????????????</span>
                    <InputNumber value={initalAmount}
                        onChange={(value: any) => setInitalAmout(value)} min={1} />
                </div>

                <div className='inputItem'>
                    <span>??????????????????????????????????????????</span>
                    <InputNumber value={perAmount}
                        onChange={(value: any) => setPerAmount(value)} min={1} />
                </div>
                <Button type='primary' onClick={saveAmountChange}>??????????????????</Button>
            </div>


            <div className=''> {currentPlanName === null ? null :
                <Select defaultValue={currentPlanName} onChange={(value) => setCurrentPlanName(value)}>
                    {planNameList.map((element) => <Option value={element}>{element}</Option>)}
                </Select>}
                {currentPlanName === usingPlan
                    ? <span>???????????????????????????????????????????????????</span>
                    : <Button onClick={setPlan}>????????????????????????????????????????????????</Button>}
            </div>
            <div className='giftlist'>
                <ul>
                    {currentPlan === null ? <p>????????????????????????</p> :
                        currentPlan.map(({ giftname, chance, url }: any) => <li className='listItem'>
                            <div>
                                <p>{`????????????: ${giftname}`}</p>
                                <p>{`????????????: ${chance}%`}</p>
                                {url === null ? giftIcon : <img src={url} className='previewPic' />}
                            </div>
                        </li>
                        )}
                </ul>
                {currentPlanName == '??????????????????'
                    ? <Button type='primary' disabled>?????????????????????????????????????????????</Button>
                    : <Button type='primary' onClick={() => props.func({
                        data: currentPlan,
                        planName: currentPlanName,
                        currentState: 'modify'
                    })}><Link to='/'>???????????????</Link></Button>}
                <Button type='primary' danger
                    className={classNames({
                        deleteButton: true,
                        buttShow: !(currentPlanName != '??????????????????')
                    })}
                    onClick={() => setModalVisible(true)}>???????????????</Button>
                <Modal title='???????????????'
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={handleDelete}
                >
                    <p>???????????????????????????{currentPlanName}</p>
                    <p>??????????????????????????????????????????????????????????????????????????????????????????????????????</p>
                </Modal>
            </div>

        </div>
    )
}
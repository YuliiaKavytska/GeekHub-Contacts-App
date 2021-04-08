import anonim from "../../assets/image/anonim.png"
import life from "../../assets/image/life.png"
import kiev from "../../assets/image/kiev.png"
import vodafone from "../../assets/image/vodafone.jpg"

export function defineOperator(number: string) {
    let operator = anonim
    if (number.match(/(063|073|093)/)) {
        operator = life
    } else if (number.match(/(067|068|096|097|098)/)) {
        operator = kiev
    } else if (number.match(/(050|066|095|099)/)) {
        operator = vodafone
    }
    return operator
}

"use client"

import { useState } from "react"
import { Input, DatePicker, Switch, Select, Button, Card } from "antd"
import { FiMapPin, FiArrowRight, FiHome, FiCalendar } from "react-icons/fi"
import { motion } from "framer-motion"
import dayjs from "dayjs"

const { Option } = Select

export default function LocationStep({ data, onUpdate, onNext }) {
  const [errors, setErrors] = useState({})

  const validateAndNext = () => {
    const newErrors = {}
    if (!data.pickup.pincode) newErrors.pickupPincode = "Pincode required"
    if (!data.pickup.city) newErrors.pickupCity = "City required"
    if (!data.drop.pincode) newErrors.dropPincode = "Pincode required"
    if (!data.drop.city) newErrors.dropCity = "City required"
    if (!data.date) newErrors.date = "Moving date required"

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onNext()
    }
  }

  const updatePickup = (field, value) => {
    onUpdate({
      ...data,
      pickup: { ...data.pickup, [field]: value },
    })
  }

  const updateDrop = (field, value) => {
    onUpdate({
      ...data,
      drop: { ...data.drop, [field]: value },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Moving Date */}
      <Card className="shadow-sm border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FiCalendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Moving Date</h3>
            <p className="text-sm text-gray-500">When do you want to shift?</p>
          </div>
        </div>
        <DatePicker
          className="w-full h-12"
          size="large"
          placeholder="Select moving date"
          value={data.date ? dayjs(data.date) : null}
          onChange={(date) => onUpdate({ ...data, date: date ? date.toDate() : null })}
          disabledDate={(current) => current && current < dayjs().startOf("day")}
          status={errors.date ? "error" : ""}
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </Card>

      {/* Pickup Location */}
      <Card className="shadow-sm border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <FiMapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Pickup Location</h3>
            <p className="text-sm text-gray-500">Where are we picking up from?</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            size="large"
            placeholder="Address Line 1"
            value={data.pickup.address1}
            onChange={(e) => updatePickup("address1", e.target.value)}
          />
          <Input
            size="large"
            placeholder="Address Line 2 (Optional)"
            value={data.pickup.address2}
            onChange={(e) => updatePickup("address2", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                size="large"
                placeholder="Pincode"
                value={data.pickup.pincode}
                onChange={(e) => updatePickup("pincode", e.target.value)}
                status={errors.pickupPincode ? "error" : ""}
              />
              {errors.pickupPincode && <p className="text-red-500 text-xs mt-1">{errors.pickupPincode}</p>}
            </div>
            <div>
              <Input
                size="large"
                placeholder="City"
                value={data.pickup.city}
                onChange={(e) => updatePickup("city", e.target.value)}
                status={errors.pickupCity ? "error" : ""}
              />
              {errors.pickupCity && <p className="text-red-500 text-xs mt-1">{errors.pickupCity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              size="large"
              placeholder="State"
              value={data.pickup.state}
              onChange={(e) => updatePickup("state", e.target.value)}
            />
            <Select
              size="large"
              placeholder="Floor"
              className="w-full"
              value={data.pickup.floor || undefined}
              onChange={(value) => updatePickup("floor", value)}
            >
              <Option value="ground">Ground Floor</Option>
              <Option value="1">1st Floor</Option>
              <Option value="2">2nd Floor</Option>
              <Option value="3">3rd Floor</Option>
              <Option value="4">4th Floor</Option>
              <Option value="5+">5th Floor+</Option>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FiHome className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Lift Available</span>
            </div>
            <Switch checked={data.pickup.hasLift} onChange={(checked) => updatePickup("hasLift", checked)} />
          </div>
        </div>
      </Card>

      {/* Drop Location */}
      <Card className="shadow-sm border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <FiMapPin className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Drop Location</h3>
            <p className="text-sm text-gray-500">Where should we deliver?</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            size="large"
            placeholder="Address Line 1"
            value={data.drop.address1}
            onChange={(e) => updateDrop("address1", e.target.value)}
          />
          <Input
            size="large"
            placeholder="Address Line 2 (Optional)"
            value={data.drop.address2}
            onChange={(e) => updateDrop("address2", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                size="large"
                placeholder="Pincode"
                value={data.drop.pincode}
                onChange={(e) => updateDrop("pincode", e.target.value)}
                status={errors.dropPincode ? "error" : ""}
              />
              {errors.dropPincode && <p className="text-red-500 text-xs mt-1">{errors.dropPincode}</p>}
            </div>
            <div>
              <Input
                size="large"
                placeholder="City"
                value={data.drop.city}
                onChange={(e) => updateDrop("city", e.target.value)}
                status={errors.dropCity ? "error" : ""}
              />
              {errors.dropCity && <p className="text-red-500 text-xs mt-1">{errors.dropCity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              size="large"
              placeholder="State"
              value={data.drop.state}
              onChange={(e) => updateDrop("state", e.target.value)}
            />
            <Select
              size="large"
              placeholder="Floor"
              className="w-full"
              value={data.drop.floor || undefined}
              onChange={(value) => updateDrop("floor", value)}
            >
              <Option value="ground">Ground Floor</Option>
              <Option value="1">1st Floor</Option>
              <Option value="2">2nd Floor</Option>
              <Option value="3">3rd Floor</Option>
              <Option value="4">4th Floor</Option>
              <Option value="5+">5th Floor+</Option>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FiHome className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Lift Available</span>
            </div>
            <Switch checked={data.drop.hasLift} onChange={(checked) => updateDrop("hasLift", checked)} />
          </div>
        </div>
      </Card>

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="primary"
          size="large"
          onClick={validateAndNext}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          Next: Select Items
          <FiArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}

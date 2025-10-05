"use client"

import React, { useState, useTransition } from 'react'
import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'

const DeleteModal = ({ action }: { action: () => Promise<any> }) => {
      const [open, setOpen] = useState(false)
      const [isPending, startTransition] = useTransition()
      const handleDelete = () => {
            startTransition(async () => {
                  await action()
                  setOpen(false)
            })
      }
      return (
            <Dialog open={open}>
                  <DialogTrigger onClick={() => {
                        setOpen(true)
                  }} asChild className='cursor-pointer p-1 bg-white rounded-md'>
                        <Trash className='h-6 w-6' />
                  </DialogTrigger>
                  <DialogContent className='!rounded-3xl p-10 pb-4 font-poppins'>
                        <DialogHeader>
                              <DialogTitle className='font-poppins'>Would you like to permanently delete this video?</DialogTitle>
                              <DialogDescription className='font-semibold'>
                                    Once deleted, this video will no longer be accessible.
                              </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className='*:font-bold pt-12'>
                              <DialogTrigger onClick={() => {
                                    setOpen(false)
                              }} className='pr-6 cursor-pointer'>
                                    Cancel
                              </DialogTrigger>
                              <Button onClick={handleDelete} disabled={isPending} variant={"destructive"} className='rounded-2xl'>{isPending ? "Loading" : "Permanently delete"}</Button>
                        </DialogFooter>
                  </DialogContent>
            </Dialog>
      )
}

export default DeleteModal
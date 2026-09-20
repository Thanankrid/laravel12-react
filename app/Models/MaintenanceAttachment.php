<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceAttachment extends Model
{
    protected $fillable = [
        'maintenance_request_id',
        'user_id',
        'original_name',
        'path',
        'mime_type',
        'size',
    ];

    // path เป็นที่อยู่ไฟล์บนเซิร์ฟเวอร์ จึงไม่ส่งออกไปกับ JSON
    protected $hidden = [
        'path',
    ];

    public function request()
    {
        return $this->belongsTo(
            MaintenanceRequest::class,
            'maintenance_request_id'
        );
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

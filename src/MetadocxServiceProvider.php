<?php

namespace Metadocx;

use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Service provider
 * 
 */
class MetadocxServiceProvider extends ServiceProvider
{
    public function boot()
    {

        $this->publishes([
            // JS
            __DIR__ . '/../dist/metadocx.js' => public_path('js/metadocx.js'),            
            __DIR__ . '/../dist/metadocx.min.js' => public_path('js/metadocx.min.js'),    
            __DIR__ . '/../dist/maps/metadocx.min.js.map' => public_path('js/maps/metadocx.min.js.map'),                    
            // CSS
            __DIR__ . '/../dist/metadocx.css' => public_path('css/metadocx.css'),
            __DIR__ . '/../dist/metadocx.min.css' => public_path('css/metadocx.min.css'),
            // Images
            __DIR__ . '/../assets/images/' => public_path('images/metadocx/'),
            // Xsl             
            __DIR__ . '/../assets/xsl/toc.xsl' => public_path('css/toc.xsl'),
        ], 'metadocx');
    }

}
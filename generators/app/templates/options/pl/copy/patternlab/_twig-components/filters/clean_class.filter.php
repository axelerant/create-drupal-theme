<?php

/**
 * @file
 * Drupalastic Twig Extension to clean class names.
 */

/**
 * Helper function to clean up potential class names.
 *
 * @param Twig_Environment $env
 *   Current Twig environment.
 * @param string $config
 *   Current configuration state.
 */
function add_clean_class_filter(Twig_Environment &$env, $config) {
  $env->addFilter(new Twig_SimpleFilter('clean_class', function ($string) {
    return $string;
  }));
}
